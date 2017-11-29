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

export interface SaveStoreCallbacks {
  onBeforeSavingStore?: <S>(store: S) => S;
  onRequestShrinkStore: <S>(store: S) => S;
}

export interface State<S, U> extends LocationState {
  store?: S;
  userState?: U;
}

const tryReplace = <S, U>(
  history: History,
  path: string,
  store: S,
  userState: U,
  onRequestShrinkStore: (store: S) => S,
) => {
  try {
    history.location.state = { store, userState };
  } catch (err) {
    tryReplace(
      history,
      path,
      onRequestShrinkStore(store),
      userState,
      onRequestShrinkStore,
    );
  }
};

export const createRestoreMiddleware = <S, U>(
  history: History,
  onRequestShrinkStore: <T>(store: T) => T,
  onBeforeSavingStore?: <T>(store: T) => T,
): Middleware => {
  return <T>({ dispatch, getState }: MiddlewareAPI<T>) => {
    const replacingKeys: string[] = [];

    history.listen((location, action) => {
      const state = location.state as State<S, U>;
      if (state == null || state.store == null) {
        return;
      }
      dispatch(restore(state.store));
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

        const state: State<S, U> = history.location.state;
        const path = `${history.location.pathname}${history.location
          .search}${history.location.hash}`;
        let store = getState();
        if (onBeforeSavingStore != null) {
          store = onBeforeSavingStore(store);
        }

        replacingKeys.push(history.location.key);
        tryReplace(
          history,
          path,
          store,
          state == null ? undefined : state.userState,
          onRequestShrinkStore,
        );

        return next(action);
      };
    };
  };
};

export const createHistoryMiddleware = <S, U>(history: History): Middleware => {
  return <T>({ dispatch, getState }: MiddlewareAPI<T>) => {
    {
      // 1. Publish LocationAction representing the initial Location.
      // 2. Publish routing result action for initial Location.
      const { key, pathname, search, hash, state } = history.location;
      dispatch(
        changed(history.action, (history as any).index, history.length, {
          key,
          pathname,
          search,
          hash,
          state: state == null ? undefined : state.userState,
        }),
      );
    }

    // 1. Subscribe history event from history API.
    // 2. Detect publishing POP / PUSH / REPLACE event from history API.
    // 3. Publish LocationAction representing the current Location.
    // 4. Publish routing result action for the Location.
    history.listen((location, action) => {
      const { key, pathname, search, hash, state } = location;
      dispatch(
        changed(action, (history as any).index, history.length, {
          key,
          pathname,
          search,
          hash,
          state: state == null ? undefined : state.userState,
        }),
      );
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
              const currentState: State<S, U> = history.location.state;
              const { path, userState } = action as PathAction;
              const nextState = {
                ...currentState == null ? {} : currentState.userState,
                ...userState == null ? {} : userState,
              };
              const state: State<S, U> = {};
              if (Object.keys(nextState).length !== 0) {
                state.userState = nextState;
              }
              history.push(
                path,
                Object.keys(state).length === 0 ? null : state,
              );
            }
            break;
          case HISTORY_REPLACE:
            {
              const currentState: State<S, U> = history.location.state;
              const { path, userState } = action as PathAction;
              const nextState = {
                ...currentState == null ? {} : currentState.userState,
                ...userState == null ? {} : userState,
              };
              const state: State<S, U> = {};
              if (Object.keys(nextState).length !== 0) {
                state.userState = nextState;
              }
              history.replace(
                path,
                Object.keys(state).length === 0 ? null : state,
              );
            }
            break;
        }
        return next(action);
      };
    };
  };
};

export const createRouterMiddleware = (
  history: History,
  router: Router,
): Middleware => {
  return <T>({ dispatch, getState }: MiddlewareAPI<T>) => {
    dispatch(route(router.exec(history.location.pathname)));
    history.listen((location, action) => {
      const { key, pathname, search, hash, state } = location;
      dispatch(route(router.exec(pathname)));
    });
    return next => {
      return <A extends HistoryAction>(action: A) => {
        return next(action);
      };
    };
  };
};

export const createStaticRouterMiddleware = <S>(
  pathname: string,
  router: Router,
): Middleware => {
  return <T>({ dispatch }: MiddlewareAPI<T>) => {
    // Publish routing result action for static location.
    dispatch(route(router.exec(pathname)));
    return next => {
      return action => {
        return next(action);
      };
    };
  };
};
