import {
  Route,
  ROUTE_FOUND,
  ROUTE_NOT_FOUND,
  RouteAction,
} from "./action";

export function reduceRouting(state: any = {}, action: RouteAction): Route {
  switch (action.type) {
    case ROUTE_FOUND:
    case ROUTE_NOT_FOUND:
      return action.payload;
    default:
      return state;
  }
}
