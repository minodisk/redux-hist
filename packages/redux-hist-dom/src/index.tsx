import * as React from "react";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {push} from "redux-router";

export interface LinkProps {
  className?: string;
  style?: any;
  target?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  to: string;
  push: (pathname: string) => void;
}

class LinkBase extends React.Component<LinkProps, {}> {
  public render() {
    return (
      <a
        onClick={this.onClick}
        href={this.props.to}
        className={this.props.className}
        style={this.props.style}
      >
        {
          this.props.children
        }
      </a>
    );
  }

  private onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (this.props.onClick != null) {
      this.props.onClick(e);
    }

    if (
      e.defaultPrevented ||
      e.button > 0 ||
      this.props.target ||
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey
    ) {
      return;
    }

    e.preventDefault();
    this.props.push(this.props.to);
  }
}

export const Link = connect<void, {}, LinkProps>(
  null,
  (dispatch: Dispatch<any>, props: LinkProps): any => {
    return {
      push: (pathname: string) => dispatch(push(pathname)),
    };
  },
)(LinkBase);
