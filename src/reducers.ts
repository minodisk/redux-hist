import {
  LOCATION_CHANGED,
  LocationAction,
  RESTORE,
  RestoreAction,
  ROUTE_FOUND,
  ROUTE_NOT_FOUND,
  RouteAction,
} from "./actions";

export const reduceStore = <S>(state: any = {}, action: RestoreAction<S>) => {
  switch (action.type) {
    case RESTORE:
      return action.store;
    default:
      return state;
  }
};

export const reduceLocation = (state: any = {}, action: LocationAction) => {
  switch (action.type) {
    case LOCATION_CHANGED:
      return {
        action: action.action,
        location: action.location,
      };
    default:
      return state;
  }
};

export const reduceRoute = (state: any = {}, action: RouteAction) => {
  switch (action.type) {
    case ROUTE_FOUND:
      return {
        action: action.action,
        route: action.route,
      };
    case ROUTE_NOT_FOUND:
      return {
        action: action.action,
      };
    default:
      return state;
  }
};
