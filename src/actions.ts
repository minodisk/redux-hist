import { Action as OriginalHistoryActionType, Location, Path } from "history";
import { Action } from "redux";
import { Option, State } from "./middlewares";
import { Params, Route } from "./router";

export type HistoryActionType = OriginalHistoryActionType | "STATIC";

export const HISTORY_GO_BACK = "HISTORY_GO_BACK";
export const HISTORY_GO_FORWARD = "HISTORY_GO_FORWARD";
export const goBack = (): Action => {
  return {
    type: HISTORY_GO_BACK,
  };
};
export const goForward = (): Action => {
  return {
    type: HISTORY_GO_FORWARD,
  };
};

export const HISTORY_GO = "HISTORY_GO";
export interface DiffAction extends Action {
  diff: number;
}
export const go = (diff: number): DiffAction => {
  return {
    type: HISTORY_GO,
    diff,
  };
};

export const HISTORY_PUSH = "HISTORY_PUSH";
export const HISTORY_REPLACE = "HISTORY_REPLACE";
export interface PathAction extends Action {
  path: Path;
  userState?: any;
}
export const push = (path: Path, userState?: any): PathAction => {
  return {
    type: HISTORY_PUSH,
    path,
    userState,
  };
};
export const replace = (path: Path, userState?: any): PathAction => {
  return {
    type: HISTORY_REPLACE,
    path,
    userState,
  };
};

export type HistoryAction = Action | DiffAction | PathAction;

export const LOCATION_CHANGED = "LOCATION_CHANGED";
export interface LocationAction extends Action {
  action: HistoryActionType;
  index: number;
  length: number;
  location: Location;
  option: Option;
}
export const changed = (
  action: HistoryActionType,
  index: number,
  length: number,
  location: Location,
  option: Option,
): LocationAction => {
  return {
    type: LOCATION_CHANGED,
    action,
    index,
    length,
    location,
    option,
  };
};

export const ROUTE_FOUND = "ROUTE_FOUND";
export const ROUTE_NOT_FOUND = "ROUTE_NOT_FOUND";
export interface RouteAction extends Action {
  action: HistoryActionType;
  route?: Route;
}
export const route = (action: HistoryActionType, r?: Route): RouteAction => {
  if (r == null) {
    return {
      type: ROUTE_NOT_FOUND,
      action,
    };
  }
  return {
    type: ROUTE_FOUND,
    action,
    route: r,
  };
};

export const RESTORE = "RESTORE";
export interface RestoreAction<S> extends Action {
  store: S;
}
export const restore = <S>(store: S): RestoreAction<S> => {
  return {
    type: RESTORE,
    store,
  };
};
