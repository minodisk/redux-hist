import { History, Location, LocationState } from "history";
import { Action, Dispatch, Middleware, MiddlewareAPI, Store } from "redux";
import {
  changed,
  DiffAction,
  HISTORY_GO,
  HISTORY_GO_BACK,
  HISTORY_GO_FORWARD,
  HISTORY_PUSH,
  HISTORY_REPLACE,
  HistoryAction,
  LOCATION_CHANGED,
  LocationAction,
  PathAction,
  restore,
  route,
  RouteAction,
} from "./actions";
import { Router } from "./router";

export interface Option {
  saveStore?: {
    onBeforeSavingStore?: <S>(store: S) => S;
    onRequestShrinkStore: <S>(store: S) => S;
  };
}

export interface State<S> extends LocationState {
  internal: boolean;
  store: S;
  userState: any;
}

const tryReplace = <S>(
  history: History,
  path: string,
  store: S,
  userState: any,
  onRequestShrinkStore: (store: S) => S,
) => {
  try {
    const state: State<S> = { internal: true, store, userState };
    history.replace(path, state);
  } catch (err) {
    if (err.name === "") {
      tryReplace(
        history,
        path,
        userState,
        onRequestShrinkStore(store),
        onRequestShrinkStore,
      );
    }
  }
};

export function createHistoryMiddleware<S>(
  router: Router,
  history: History,
  option?: Option,
): Middleware {
  if (option == null) {
    option = {
      saveStore: null,
    };
  }
  return <T>({ dispatch, getState }: MiddlewareAPI<T>) => {
    // 1. Publish LocationAction representing the initial Location.
    // 2. Publish routing result action for initial Location.
    dispatch(
      changed(
        history.action,
        (history as any).index,
        history.length,
        history.location,
        option,
      ),
    );
    dispatch(route(history.action, router.exec(history.location.pathname)));

    // 1. Subscribe history event from history API.
    // 2. Detect publishing POP / PUSH / REPLACE event from history API.
    // 3. Publish LocationAction representing the current Location.
    // 4. Publish routing result action for the Location.
    history.listen((location, action) => {
      const { internal, store, userState } = location.state as State<S>;
      dispatch(restore(store));
      if (internal) {
        return;
      }
      dispatch(
        changed(
          action,
          (history as any).index,
          history.length,
          location,
          option,
        ),
      );
      dispatch(route(action, router.exec(location.pathname)));
    });

    return next => {
      return <A extends HistoryAction>(action: A) => {
        // History action
        if (
          action.type !== HISTORY_GO_BACK &&
          action.type !== HISTORY_GO_FORWARD &&
          action.type !== HISTORY_GO &&
          action.type !== HISTORY_PUSH &&
          action.type !== HISTORY_REPLACE
        ) {
          return next(action);
        }

        // 1. (Optional) Sync store to current location.
        // 2. Call History API.
        // 3. Pass the action to the next callback.
        // 4. Return action.
        if (option.saveStore != null) {
          const {
            onBeforeSavingStore,
            onRequestShrinkStore,
          } = option.saveStore;
          const path = `${history.location.pathname}${history.location
            .search}${history.location.hash}`;
          const state: State<S> = history.location.state;
          let store = getState();
          if (onBeforeSavingStore != null) {
            store = onBeforeSavingStore(store);
          }
          tryReplace(history, path, state, store, onRequestShrinkStore);
        }
        switch (action.type) {
          case HISTORY_GO_BACK:
            history.goBack();
            break;
          case HISTORY_GO_FORWARD:
            history.goForward();
            break;
          case HISTORY_GO:
            history.go((action as DiffAction).diff);
            break;
          case HISTORY_PUSH:
            {
              const { path, userState } = action as PathAction;
              const state: State<S> = {
                internal: false,
                store: null,
                userState,
              };
              history.push(path, state);
            }
            break;
          case HISTORY_REPLACE:
            {
              const { path, userState } = action as PathAction;
              const state: State<S> = {
                internal: false,
                store: null,
                userState,
              };
              history.replace(path, state);
            }
            break;
        }
        return next(action);
      };
    };
  };
}

export function createStaticRouterMiddleware<S>(
  router: Router,
  pathname: string,
): Middleware {
  return <T>({ dispatch }: MiddlewareAPI<T>) => {
    // Publish routing result action for static location.
    dispatch(route("STATIC", router.exec(pathname)));
    return next => {
      return action => {
        return next(action);
      };
    };
  };
}
