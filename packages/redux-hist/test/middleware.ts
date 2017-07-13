import {createMemoryHistory} from "history";
import "mocha";
import {
  deepStrictEqual,
  notDeepStrictEqual,
  notStrictEqual,
  ok,
  strictEqual,
} from "power-assert";
import {Action} from "redux-actions";
import {
  Actions,
  back,
  createRouterMiddleware,
  createStaticRouterMiddleware,
  DestinationAction,
  forward,
  go,
  HISTORY_BACK,
  HISTORY_FORWARD,
  HISTORY_GO,
  HISTORY_POPED,
  HISTORY_PUSH,
  HISTORY_PUSHED,
  HISTORY_REPLACE,
  HISTORY_REPLACED,
  LocationAction,
  push,
  replace,
  ROUTE_FOUND,
  ROUTE_NOT_FOUND,
  RouteAction,
  Router,
} from "redux-router";

describe("createRouterMiddleware", () => {

  it("should subscribe router action and publish valid action", () => {
    const router = new Router();
    router.route("/users/:user_id");
    const history = createMemoryHistory();
    const dispatch = 0;
    const next = 1;
    const cases: Array<{
      message: string,
      publishWith: number,
      action: Actions,
    }> = [
      {
        message: "router can not find routing to initial location",
        publishWith: dispatch,
        action: {
          type: ROUTE_NOT_FOUND,
          payload: {
            action: "PUSH",
          },
        },
      },
      {
        message: "push /users",
        publishWith: next,
        action: {
          type: HISTORY_PUSH,
          payload: {
            path: "/users",
            state: undefined,
          },
        },
      },
      {
        message: "detect pushing /users",
        publishWith: dispatch,
        action: {
          type: HISTORY_PUSHED,
          payload: {
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
          payload: {
            action: "PUSH",
          },
        },
      },
      {
        message: "push /users",
        publishWith: next,
        action: {
          type: HISTORY_PUSH,
          payload: {
            path: "/users/100",
            state: undefined,
          },
        },
      },
      {
        message: "detect pushing /users/100",
        publishWith: dispatch,
        action: {
          type: HISTORY_PUSHED,
          payload: {
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
          payload: {
            action: "PUSH",
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
          type: HISTORY_BACK,
        },
      },
      {
        message: "detect back to /users",
        publishWith: dispatch,
        action: {
          type: HISTORY_POPED,
          payload: {
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
          payload: {
            action: "POP",
          },
        },
      },
      {
        message: "forward to /users",
        publishWith: next,
        action: {
          type: HISTORY_FORWARD,
        },
      },
      {
        message: "detect forward to /users",
        publishWith: dispatch,
        action: {
          type: HISTORY_POPED,
          payload: {
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
          payload: {
            action: "POP",
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
          payload: -2,
        },
      },
      {
        message: "detect going to /users",
        publishWith: dispatch,
        action: {
          type: HISTORY_POPED,
          payload: {
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
          payload: {
            action: "POP",
          },
        },
      },
      {
        message: "go to /users",
        publishWith: next,
        action: {
          type: HISTORY_GO,
          payload: 2,
        },
      },
      {
        message: "detect going to /users",
        publishWith: dispatch,
        action: {
          type: HISTORY_POPED,
          payload: {
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
          payload: {
            action: "POP",
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
          payload: {
            path: "/users/200",
            state: undefined,
          },
        },
      },
      {
        message: "detect replacing /users/200",
        publishWith: dispatch,
        action: {
          type: HISTORY_REPLACED,
          payload: {
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
          payload: {
            action: "REPLACE",
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
          payload: {
            path: "/users",
            state: undefined,
          },
        },
      },
      {
        message: "detect replacing /users",
        publishWith: dispatch,
        action: {
          type: HISTORY_REPLACED,
          payload: {
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
          payload: {
            action: "REPLACE",
          },
        },
      },
      {
        message: "replace /users",
        publishWith: next,
        action: {
          type: HISTORY_REPLACE,
          payload: {
            path: "/users/300",
            state: undefined,
          },
        },
      },
      {
        message: "detect replacing /users/300",
        publishWith: dispatch,
        action: {
          type: HISTORY_REPLACED,
          payload: {
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
          payload: {
            action: "REPLACE",
            params: {
              user_id: "300",
            },
          },
        },
      },
    ];
    let i = 0;
    const act = createRouterMiddleware(router, history)({
      getState: () => {
        return {};
      },
      dispatch: (action) => {
        const a = action as Actions;
        const c = cases.shift();
        if (a.payload != null && (a as LocationAction).payload.key != null) {
          (c.action as LocationAction).payload.key = (a as LocationAction).payload.key;
        }
        strictEqual(c.publishWith, dispatch);
        deepStrictEqual(action, c.action, `dispatch: ${c.message}`);
        i++;
        return action;
      },
    })(
      (action) => {
        const c = cases.shift();
        strictEqual(c.publishWith, next);
        deepStrictEqual(action, c.action, `next: ${c.message}`);
        i++;
        return action;
      },
    );

    for (const c of [
      {
        destinationAction: push("/users"),
        length: 2,
        action: "PUSH",
        index: 1,
        pathname: "/users",
        state: undefined,
      },
      {
        destinationAction: push("/users/100"),
        length: 3,
        action: "PUSH",
        index: 2,
        pathname: "/users/100",
        state: undefined,
      },
      {
        destinationAction: back(),
        length: 3,
        action: "POP",
        index: 1,
        pathname: "/users",
        state: undefined,
      },
      {
        destinationAction: forward(),
        length: 3,
        action: "POP",
        index: 2,
        pathname: "/users/100",
        state: undefined,
      },
      {
        destinationAction: go(-2),
        length: 3,
        action: "POP",
        index:  0,
        pathname: "/",
        state: undefined,
      },
      {
        destinationAction: go(2),
        length: 3,
        action: "POP",
        index:  2,
        pathname: "/users/100",
        state: undefined,
      },
      {
        destinationAction: replace("/users/200"),
        length: 3,
        action: "REPLACE",
        index:  2,
        pathname: "/users/200",
        state: undefined,
      },
      {
        destinationAction: replace("/users"),
        length: 3,
        action: "REPLACE",
        index:  2,
        pathname: "/users",
        state: undefined,
      },
      {
        destinationAction: replace("/users/300"),
        length: 3,
        action: "REPLACE",
        index:  2,
        pathname: "/users/300",
        state: undefined,
      },
    ] as Array<{
      destinationAction: DestinationAction,
      length: number,
      action: string,
      index: number,
      pathname: string,
      state: any,
    }>) {
      act(c.destinationAction);
      strictEqual(history.length, c.length, "length");
      strictEqual(history.action, c.action, "action");
      strictEqual(history.index, c.index, "index");
      strictEqual(history.location.pathname, c.pathname, "location.pathname");
      strictEqual(history.location.state, c.state, "locaton.state");
    }

    strictEqual(cases.length, 0);
  });
});

describe("createStaticRouterMiddleware", () => {
  it("should execute routing once and publish not found action", () => {
    const router = new Router();
    router.route("/users/:user_id");
    const cases: Array<{
      message: string,
      action: Actions,
    }> = [
      {
        message: "router can not find routing for /users",
        action: {
          type: ROUTE_NOT_FOUND,
          payload: {
            action: "PUSH",
          },
        },
      },
    ];
    createStaticRouterMiddleware(router, "/users")({
      getState: () => {
        return {};
      },
      dispatch: (action) => {
        const c = cases.shift();
        deepStrictEqual(action, c.action, c.message);
        return action;
      },
    })(
      (action) => {
        ok(false, "next should not be called");
        return action;
      },
    );
    strictEqual(cases.length, 0);
  });

  it("should execute routing once and publish found action", () => {
    const router = new Router();
    router.route("/users/:user_id");
    const cases: Array<{
      message: string,
      action: Actions,
    }> = [
      {
        message: "router can find routing for /users/100",
        action: {
          type: ROUTE_FOUND,
          payload: {
            action: "PUSH",
            params: {
              user_id: "100",
            },
          },
        },
      },
    ];
    createStaticRouterMiddleware(router, "/users/100")({
      getState: () => {
        return {};
      },
      dispatch: (action) => {
        const c = cases.shift();
        deepStrictEqual(action, c.action, c.message);
        return action;
      },
    })(
      (action) => {
        ok(false, "next should not be called");
        return action;
      },
    );
    strictEqual(cases.length, 0);
  });
});
