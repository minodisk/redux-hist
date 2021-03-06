import {
  Action,
  History,
} from "history";
import {
  Dispatch,
  Middleware,
  MiddlewareAPI,
} from "redux";

import {
  changed,
  DestinationAction,
  DiffAction,
  found,
  HISTORY_CHANGED,
  HISTORY_GO,
  HISTORY_GO_BACK,
  HISTORY_GO_FORWARD,
  HISTORY_PUSH,
  HISTORY_REPLACE,
  HistoryAction,
  notFound,
  RoutingAction,
} from "./actions";
import {Router} from "./router";

export const POP: Action = "POP";
export const PUSH: Action = "PUSH";
export const REPLACE: Action = "REPLACE";

export function createRouterMiddleware(router: Router, history: History): Middleware {
  return ({dispatch}) => {
    // 1. Publish HistoryAction representing the initial History.
    // 2. Publish routing result action for initial Location.
    dispatchCurrentHistory(dispatch, history);
    dispatchRoutingResult(router, dispatch, history.location.pathname, history.action);

    // 1. Subscribe history event from history API.
    // 2. Detect publishing POP / PUSH / REPLACE event from history API.
    // 3. Publish HistoryAction representing the current History.
    // 4. Publish routing result action for the Location.
    history.listen((location, action) => {
      dispatchCurrentHistory(dispatch, history);
      dispatchRoutingResult(router, dispatch, location.pathname, action);
      return;
    });

    return (next) => {
      return (action) => {
        // 1. Detect ChangeAction from outside system.
        // 2. Pass the action to the next callback.
        // 3. Operate History API.
        // 4. Return the result of the next callback.
        switch (action.type) {
          case HISTORY_GO_BACK: {
            const result = next(action);
            history.goBack();
            return result;
          }
          case HISTORY_GO_FORWARD: {
            const result = next(action);
            history.goForward();
            return result;
          }
          case HISTORY_GO: {
            const result = next(action);
            history.go((action as DiffAction).payload);
            return result;
          }
          case HISTORY_PUSH: {
            const result = next(action);
            const {
              path,
              state,
            } = (action as DestinationAction).payload;
            history.push(path, state);
            return result;
          }
          case HISTORY_REPLACE: {
            const result = next(action);
            const {
              path,
              state,
            } = (action as DestinationAction).payload;
            history.replace(path, state);
            return result;
          }

          // Pass the action to the next callback.
          default:
            return next(action);
        }
      };
    };
  };
}

export function createStaticRouterMiddleware(router: Router, pathname: string): Middleware {
  return ({dispatch}) => {
    // Publish routing result action for static location.
    dispatchRoutingResult(router, dispatch, pathname, PUSH);
    return (next) => {
      return (action) => {
        return next(action);
      };
    };
  };
}

function dispatchCurrentHistory(dispatch: Dispatch<HistoryAction>, history: History) {
  dispatch(changed({
    action: history.action,
    entries: (history as any).entries, // history.d.ts is deficient
    index: (history as any).index, // history.d.ts is deficient
    length: history.length,
    location: history.location,
  }));
}

function dispatchRoutingResult(router: Router, dispatch: Dispatch<RoutingAction>, pathname: string, action: Action) {
  const result = router.exec(pathname);
  dispatch((result == null) ? notFound(action) : found(action, result));
}
