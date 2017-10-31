import { createMemoryHistory } from "history";
import "jest";
import { Action } from "redux-actions";
import {
  changed,
  createHistoryMiddleware,
  createStaticRouterMiddleware,
  go,
  goBack,
  goForward,
  HISTORY_GO,
  HISTORY_GO_BACK,
  HISTORY_GO_FORWARD,
  HISTORY_PUSH,
  HISTORY_REPLACE,
  HistoryAction,
  LOCATION_CHANGED,
  LocationAction,
  PathAction,
  push,
  replace,
  ROUTE_FOUND,
  ROUTE_NOT_FOUND,
  RouteAction,
  Router,
} from "../src";

test("createHistoryMiddleware() should subscribe router action and publish valid action", () => {
  const router = new Router();
  const key = router.route("/users/:user_id");
  const history = createMemoryHistory();
  const dispatch = 0;
  const next = 1;
  const cases: Array<{
    message: string;
    publishWith: number;
    action: LocationAction | HistoryAction | RouteAction;
  }> = [
    {
      message: "history action should be dispatched including initial location",
      publishWith: dispatch,
      action: {
        type: LOCATION_CHANGED,
        action: "POP",
        index: 0,
        length: 1,
        location: {
          key: "",
          pathname: "/",
          search: "",
          hash: "",
          state: undefined,
        },
      },
    },
    {
      message: "router can not find routing to initial location",
      publishWith: dispatch,
      action: {
        type: ROUTE_NOT_FOUND,
        action: "POP",
      },
    },
    {
      message: "push /users",
      publishWith: next,
      action: {
        type: HISTORY_PUSH,
        path: "/users",
      },
    },
    {
      message: "detect pushing /users",
      publishWith: dispatch,
      action: {
        type: LOCATION_CHANGED,
        action: "PUSH",
        index: 1,
        length: 2,
        location: {
          key: "",
          pathname: "/users",
          search: "",
          hash: "",
          state: undefined,
        },
      },
    },
    {
      message: "router can not find routing to push /users",
      publishWith: dispatch,
      action: {
        type: ROUTE_NOT_FOUND,
        action: "PUSH",
      },
    },
    {
      message: "push /users",
      publishWith: next,
      action: {
        type: HISTORY_PUSH,
        path: "/users/100",
      },
    },
    {
      message: "detect pushing /users/100",
      publishWith: dispatch,
      action: {
        type: LOCATION_CHANGED,
        action: "PUSH",
        index: 2,
        length: 3,
        location: {
          key: "",
          pathname: "/users/100",
          search: "",
          hash: "",
          state: undefined,
        },
      },
    },
    {
      message: "router can find routing to push /users/100",
      publishWith: dispatch,
      action: {
        type: ROUTE_FOUND,
        action: "PUSH",
        route: {
          key,
          params: {
            user_id: "100",
          },
        },
      },
    },
    {
      message: "back to /users",
      publishWith: next,
      action: {
        type: HISTORY_GO_BACK,
      },
    },
    {
      message: "detect back to /users",
      publishWith: dispatch,
      action: {
        type: LOCATION_CHANGED,
        action: "POP",
        index: 1,
        length: 3,
        location: {
          key: "",
          pathname: "/users",
          search: "",
          hash: "",
          state: undefined,
        },
      },
    },
    {
      message: "router can not find routing when back to /users",
      publishWith: dispatch,
      action: {
        type: ROUTE_NOT_FOUND,
        action: "POP",
      },
    },
    {
      message: "forward to /users",
      publishWith: next,
      action: {
        type: HISTORY_GO_FORWARD,
      },
    },
    {
      message: "detect forward to /users",
      publishWith: dispatch,
      action: {
        type: LOCATION_CHANGED,
        action: "POP",
        index: 2,
        length: 3,
        location: {
          key: "",
          pathname: "/users/100",
          search: "",
          hash: "",
          state: undefined,
        },
      },
    },
    {
      message: "router can find routing when forward to /users/100",
      publishWith: dispatch,
      action: {
        type: ROUTE_FOUND,
        action: "POP",
        route: {
          key,
          params: {
            user_id: "100",
          },
        },
      },
    },
    {
      message: "go to /users",
      publishWith: next,
      action: {
        type: HISTORY_GO,
        diff: -2,
      },
    },
    {
      message: "detect going to /users",
      publishWith: dispatch,
      action: {
        type: LOCATION_CHANGED,
        action: "POP",
        index: 0,
        length: 3,
        location: {
          key: "",
          pathname: "/",
          search: "",
          hash: "",
          state: undefined,
        },
      },
    },
    {
      message: "router can not find routing when go to /users",
      publishWith: dispatch,
      action: {
        type: ROUTE_NOT_FOUND,
        action: "POP",
      },
    },
    {
      message: "go to /users",
      publishWith: next,
      action: {
        type: HISTORY_GO,
        diff: 2,
      },
    },
    {
      message: "detect going to /users",
      publishWith: dispatch,
      action: {
        type: LOCATION_CHANGED,
        action: "POP",
        index: 2,
        length: 3,
        location: {
          key: "",
          pathname: "/users/100",
          search: "",
          hash: "",
          state: undefined,
        },
      },
    },
    {
      message: "router can find routing when go to /users/100",
      publishWith: dispatch,
      action: {
        type: ROUTE_FOUND,
        action: "POP",
        route: {
          key,
          params: {
            user_id: "100",
          },
        },
      },
    },
    {
      message: "replace /users",
      publishWith: next,
      action: {
        type: HISTORY_REPLACE,
        path: "/users/200",
      },
    },
    {
      message: "detect replacing /users/200",
      publishWith: dispatch,
      action: {
        type: LOCATION_CHANGED,
        action: "REPLACE",
        index: 2,
        length: 3,
        location: {
          key: "",
          pathname: "/users/200",
          search: "",
          hash: "",
          state: undefined,
        },
      },
    },
    {
      message: "router can find routing when replace to /users/200",
      publishWith: dispatch,
      action: {
        type: ROUTE_FOUND,
        action: "REPLACE",
        route: {
          key,
          params: {
            user_id: "200",
          },
        },
      },
    },
    {
      message: "push /users",
      publishWith: next,
      action: {
        type: HISTORY_REPLACE,
        path: "/users",
      },
    },
    {
      message: "detect replacing /users",
      publishWith: dispatch,
      action: {
        type: LOCATION_CHANGED,
        action: "REPLACE",
        index: 2,
        length: 3,
        location: {
          key: "",
          pathname: "/users",
          search: "",
          hash: "",
          state: undefined,
        },
      },
    },
    {
      message: "router can not find routing when replace to /users",
      publishWith: dispatch,
      action: {
        type: ROUTE_NOT_FOUND,
        action: "REPLACE",
      },
    },
    {
      message: "replace /users",
      publishWith: next,
      action: {
        type: HISTORY_REPLACE,
        path: "/users/300",
      },
    },
    {
      message: "detect replacing /users/300",
      publishWith: dispatch,
      action: {
        type: LOCATION_CHANGED,
        action: "REPLACE",
        index: 2,
        length: 3,
        location: {
          key: "",
          pathname: "/users/300",
          search: "",
          hash: "",
          state: undefined,
        },
      },
    },
    {
      message: "router can find routing when replace to /users/300",
      publishWith: dispatch,
      action: {
        type: ROUTE_FOUND,
        action: "REPLACE",
        route: {
          key,
          params: {
            user_id: "300",
          },
        },
      },
    },
  ];
  let i = 0;
  const entries = [];
  const act = createHistoryMiddleware(router, history)({
    getState: () => {
      return {};
    },
    dispatch: action => {
      const a = action as LocationAction | HistoryAction | RouteAction;
      const c = cases[i];
      if (a.type === LOCATION_CHANGED) {
        (c.action as LocationAction).location.key = (a as LocationAction).location.key;
      }
      expect(c.publishWith).toBe(dispatch);
      expect(action).toEqual(c.action);
      i++;
      return action;
    },
  })(action => {
    const c = cases[i];
    expect(c.publishWith).toBe(next);
    expect(action).toEqual(c.action);
    i++;
    return action;
  });

  for (const c of [
    {
      pathAction: push("/users"),
      length: 2,
      action: "PUSH",
      index: 1,
      pathname: "/users",
      state: undefined,
    },
    {
      pathAction: push("/users/100"),
      length: 3,
      action: "PUSH",
      index: 2,
      pathname: "/users/100",
      state: undefined,
    },
    {
      pathAction: goBack(),
      length: 3,
      action: "POP",
      index: 1,
      pathname: "/users",
      state: undefined,
    },
    {
      pathAction: goForward(),
      length: 3,
      action: "POP",
      index: 2,
      pathname: "/users/100",
      state: undefined,
    },
    {
      pathAction: go(-2),
      length: 3,
      action: "POP",
      index: 0,
      pathname: "/",
      state: undefined,
    },
    {
      pathAction: go(2),
      length: 3,
      action: "POP",
      index: 2,
      pathname: "/users/100",
      state: undefined,
    },
    {
      pathAction: replace("/users/200"),
      length: 3,
      action: "REPLACE",
      index: 2,
      pathname: "/users/200",
      state: undefined,
    },
    {
      pathAction: replace("/users"),
      length: 3,
      action: "REPLACE",
      index: 2,
      pathname: "/users",
      state: undefined,
    },
    {
      pathAction: replace("/users/300"),
      length: 3,
      action: "REPLACE",
      index: 2,
      pathname: "/users/300",
      state: undefined,
    },
  ] as Array<{
    pathAction: PathAction;
    length: number;
    action: string;
    index: number;
    pathname: string;
    state: any;
  }>) {
    act(c.pathAction);
    expect(history.length).toEqual(c.length);
    expect(history.action).toEqual(c.action);
    expect(history.index).toEqual(c.index);
    expect(history.location.pathname).toEqual(c.pathname);
    expect(history.location.state).toEqual(c.state);
  }

  expect(i).toEqual(cases.length);
});

test("createHistoryMiddleware() should do nothing when unrelated action is passed", () => {
  expect.assertions(1);

  const router = new Router();
  const history = createMemoryHistory();
  const action = {
    type: "unrelated",
  };
  const act = createHistoryMiddleware(router, history)({
    getState: () => {
      return {};
    },
    dispatch: a => a,
  })(a => {
    expect(a).toBe(action);
    return a;
  });
  act(action);
});

test("createStaticRouterMiddleware() should publish not found action when a routed path is passed", () => {
  expect.assertions(1);

  const router = new Router();
  router.route("/users/:user_id");
  createStaticRouterMiddleware(router, "/users")({
    getState: () => {
      return {};
    },
    dispatch: action => {
      expect(action).toEqual({
        type: ROUTE_NOT_FOUND,
        action: "PUSH",
      });
      return action;
    },
  })(action => {
    expect(false);
    return action;
  });
});

test("createStaticRouterMiddleware() should publish found action when a routed path is passed", () => {
  expect.assertions(2);

  const router = new Router();
  const key = router.route("/users/:user_id");
  createStaticRouterMiddleware(router, "/users/100")({
    getState: () => {
      return {};
    },
    dispatch: action => {
      expect(action).toEqual({
        type: ROUTE_FOUND,
        action: "PUSH",
        route: {
          key,
          params: {
            user_id: "100",
          },
        },
      });
      return action;
    },
  })(action => {
    expect(false);
    return action;
  });
});

test("createStaticRouterMiddleware() should do nothing when an unrelated action is passed", () => {
  const router = new Router();
  const history = createMemoryHistory();
  const act = createStaticRouterMiddleware(router, "/")({
    getState: () => {
      return {};
    },
    dispatch: action => action,
  })(action => {
    expect(action).toEqual({
      type: "unrelated",
    });
    return action;
  });
  act({
    type: "unrelated",
  });
});
