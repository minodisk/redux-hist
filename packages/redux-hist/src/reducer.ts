import {
  ROUTE_FOUND,
  ROUTE_NOT_FOUND,
  Routing,
  RoutingAction,
} from "./action";

export function reduceRouting(state: any = {}, action: RoutingAction): Routing {
  switch (action.type) {
    case ROUTE_FOUND:
    case ROUTE_NOT_FOUND:
      return action.payload;
    default:
      return state;
  }
}
