import {
  Action as HistoryAction,
  Location,
  LocationState,
  Path,
} from "history";
import {
  Action,
  createAction,
} from "redux-actions";

import {
  Params,
  Result,
} from "./router";

export const HISTORY_PUSH = "HISTORY_PUSH";
export const HISTORY_REPLACE = "HISTORY_REPLACE";
export const HISTORY_GO = "HISTORY_GO";
export const HISTORY_GO_BACK = "HISTORY_GO_BACK";
export const HISTORY_GO_FORWARD = "HISTORY_GO_FORWARD";

export const HISTORY_CHANGED = "HISTORY_CHANGED";

export const ROUTE_FOUND = "ROUTE_FOUND";
export const ROUTE_NOT_FOUND = "ROUTE_NOT_FOUND";

export interface Destination {
  path: Path;
  state?: LocationState;
}

function combineDestination(path: Path, state?: LocationState): Destination {
  return {path, state};
}

export interface Routing {
  action: HistoryAction;
  result?: Result;
}

export interface History {
  action: HistoryAction;
  entries: Array<Location>;
  index: number;
  length: number;
  location: Location;
}

export type DestinationAction = Action<Destination>;
export type DiffAction = Action<number>;
export type ChangeAction = DestinationAction | DiffAction;
export type HistoryAction = Action<History>;
export type RoutingAction = Action<Routing>;

const push1 = createAction<Destination, Path>(HISTORY_PUSH, combineDestination);
const push2 = createAction<Destination, Path, LocationState>(HISTORY_PUSH, combineDestination);
export function push(path: Path, state?: LocationState): DestinationAction {
  if (state == null) {
    return push1(path);
  }
  return push2(path, state);
}
const replace1 = createAction<Destination, Path>(HISTORY_REPLACE, combineDestination);
const replace2 = createAction<Destination, Path, LocationState>(HISTORY_REPLACE, combineDestination);
export function replace(path: Path, state?: LocationState): DestinationAction {
  if (state == null) {
    return replace1(path);
  }
  return replace2(path, state);
}
export const go = createAction<number>(HISTORY_GO);
export const goBack = createAction(HISTORY_GO_BACK);
export const goForward = createAction(HISTORY_GO_FORWARD);

export const changed = createAction<History>(HISTORY_CHANGED);

export const found = createAction<Routing, HistoryAction, Result>(
  ROUTE_FOUND,
  (action, result): Routing => {
    return {action, result};
  },
);
export const notFound = createAction<Routing, HistoryAction>(
  ROUTE_NOT_FOUND,
  (action): Routing => {
    return {action};
  },
);
