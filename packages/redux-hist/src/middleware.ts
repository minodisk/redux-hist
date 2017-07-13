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
  Actions,
  DestinationAction,
  HISTORY_BACK,
  HISTORY_FORWARD,
  HISTORY_GO,
  HISTORY_POPED,
  HISTORY_PUSH,
  HISTORY_PUSHED,
  HISTORY_REPLACE,
  HISTORY_REPLACED,
  LocationAction,
  NumberAction,
  OperatingAction,
  poped,
  pushed,
  replaced,
  RouteAction,
} from "./action";
import {Router} from "./router";

export const POP: Action = "POP";
export const PUSH: Action = "PUSH";
export const REPLACE: Action = "REPLACE";

export function createRouterMiddleware(router: Router, history: History): Middleware {
  return ({dispatch}) => {
    // Publish routing result action for initial Location.
    dispatch(router.run(PUSH, history.location.pathname));

    // 1. Subscribe history event from history API.
    // 2. Detect publishing POP / PUSH / REPLACE event from history API.
    // 3. Publish LocationAction representing the current Location state.
    // 4. Publish routing result action for the Location.
    history.listen((location, action) => {
      switch (action) {
        case POP:
          dispatch(poped(location));
          dispatch(router.run(POP, location.pathname));
          return;
        case PUSH:
          dispatch(pushed(location));
          dispatch(router.run(PUSH, location.pathname));
          return;
        case REPLACE:
          dispatch(replaced(location));
          dispatch(router.run(REPLACE, location.pathname));
          return;
      }
    });

    return (next) => {
      return (action) => {
        // 1. Detect OperatingAction from outside system.
        // 2. Pass the action to the next callback.
        // 3. Operate History API.
        // 4. Return the result of the next callback.
        switch (action.type) {
          case HISTORY_BACK: {
            const result = next(action);
            history.goBack();
            return result;
          }
          case HISTORY_FORWARD: {
            const result = next(action);
            history.goForward();
            return result;
          }
          case HISTORY_GO: {
            const result = next(action);
            history.go((action as NumberAction).payload);
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
    dispatch(router.run(PUSH, pathname));
    return (next) => {
      return (action) => {
        return next(action);
      };
    };
  };
}
