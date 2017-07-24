import {
  History,
  HISTORY_CHANGED,
  HistoryAction,
  ROUTE_FOUND,
  ROUTE_NOT_FOUND,
  Routing,
  RoutingAction,
} from "./actions";

export function reduceHistory(state: History, action: HistoryAction): History {
  switch (action.type) {
    case HISTORY_CHANGED:
      return action.payload;
    default:
      return state;
  }
}

export function reduceRouting(state: Routing, action: RoutingAction): Routing {
  switch (action.type) {
    case ROUTE_FOUND:
    case ROUTE_NOT_FOUND:
      return action.payload;
    default:
      return state;
  }
}
