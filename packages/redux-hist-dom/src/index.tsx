import * as React from "react";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {push} from "redux-router";

export interface LinkProps {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  push?: (pathname: string) => void;
  style?: any;
  target?: string;
  to: string;
}

class LinkBase extends React.Component<LinkProps, {}> {
  public render() {
    return (
      <a
        className={this.props.className}
        onClick={this.onClick}
        style={this.props.style}
        target={this.props.target}
        href={this.props.to}
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
