import { Location } from "history";
import { Action } from "redux";
import {
  LOCATION_CHANGED,
  LocationAction,
  RESTORE,
  RestoreAction,
  ROUTE_FOUND,
  ROUTE_NOT_FOUND,
  RouteAction,
} from "./actions";
import { Route } from "./router";

export const reduceStore = <S>(
  state: any = {},
  action: RestoreAction<S> | Action,
) => {
  switch (action.type) {
    case RESTORE:
      const { store } = action as RestoreAction<S>;
      return store;
    default:
      return state;
  }
};

export interface LocationProps {
  action: string;
  index: number;
  length: number;
  location: Location;
}
export const reduceLocation = (state: any = {}, a: LocationAction | Action) => {
  switch (a.type) {
    case LOCATION_CHANGED:
      const { action, index, length, location } = a as LocationAction;
      return {
        action,
        index,
        length,
        location,
      };
    default:
      return state;
  }
};

export interface RouteProps {
  action: string;
  route?: Route;
}
export const reduceRoute = (state: any = {}, a: RouteAction | Action) => {
  switch (a.type) {
    case ROUTE_FOUND: {
      const { action, route } = a as RouteAction;
      return {
        action,
        route,
      };
    }
    case ROUTE_NOT_FOUND: {
      const { action } = a as RouteAction;
      return {
        action,
      };
    }
    default:
      return state;
  }
};
