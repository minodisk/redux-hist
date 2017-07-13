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

export const HISTORY_PUSH = "HISTORY_PUSH";
export const HISTORY_REPLACE = "HISTORY_REPLACE";
export const HISTORY_GO = "HISTORY_GO";
export const HISTORY_BACK = "HISTORY_BACK";
export const HISTORY_FORWARD = "HISTORY_FORWARD";

export const HISTORY_POPED = "HISTORY_POPED";
export const HISTORY_PUSHED = "HISTORY_PUSHED";
export const HISTORY_REPLACED = "HISTORY_REPLACED";

export const ROUTE_FOUND = "ROUTE_FOUND";
export const ROUTE_NOT_FOUND = "ROUTE_NOT_FOUND";

export interface Destination {
  path: Path;
  state?: LocationState;
}

function combineDestination(path: Path, state?: LocationState): Destination {
  return {path, state};
}

export interface Params {
  [name: string]: string;
}

export interface Route {
  action: HistoryAction;
  params?: Params;
}

export type DestinationAction = Action<Destination>;
export type NumberAction = Action<number>;
export type OperatingAction = DestinationAction | NumberAction;

export type LocationAction = Action<Location>;
export type RouteAction = Action<Route>;

export type Actions = OperatingAction | LocationAction | RouteAction;

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
export const back = createAction(HISTORY_BACK);
export const forward = createAction(HISTORY_FORWARD);

export const poped =  createAction<Location>(HISTORY_POPED);
export const pushed =  createAction<Location>(HISTORY_PUSHED);
export const replaced =  createAction<Location>(HISTORY_REPLACED);

export const found = createAction<Route, HistoryAction, Params>(ROUTE_FOUND, (action, params) => {
  return {action, params};
});
export const notFound = createAction<Route, HistoryAction>(ROUTE_NOT_FOUND, (action) => {
  return {action};
});
