import {
  History,
  HistoryAction,
  LOCATION_CHANGED,
  ROUTE_FOUND,
  ROUTE_NOT_FOUND,
  RouteAction,
  Routing,
} from "./actions";

export function reduceHistory(state: any = {}, action: HistoryAction): History {
  switch (action.type) {
    case LOCATION_CHANGED:
      return action.payload;
    default:
      return state;
  }
}

export function reduceRouting(state: any = {}, action: RouteAction): Routing {
  switch (action.type) {
    case ROUTE_FOUND:
    case ROUTE_NOT_FOUND:
      return action.payload;
    default:
      return state;
  }
}
