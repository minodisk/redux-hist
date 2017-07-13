import * as React from "react";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {push} from "redux-router";

interface Props {
  push?: (p: string) => void;

class Component extends React.Component<{}, {}> {
  public render() {
    return (
      <div>
        <nav>
          <Link to="/users">users</a>
          <Link to="/users/100">user "100"</a>
        </nav>
        <main>
          <h1></h1>
        </main>
      </div>
    );
  }
}

export default connect<{}, {}, Props>(
  (state: any, props: Props): any => {
    return {
      route: state.route,
    };
  },
  (dispatch: Dispatch<any>, props: Props): any => {
    return {
      push: (path: string) => dispatch(push(path)),
    };
  },
)(Component);
