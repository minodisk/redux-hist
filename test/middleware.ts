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
  ChangeAction,
  changed,
  createRouterMiddleware,
  createStaticRouterMiddleware,
  DestinationAction,
  go,
  goBack,
  goForward,
  HISTORY_CHANGED,
  HISTORY_GO,
  HISTORY_GO_BACK,
  HISTORY_GO_FORWARD,
  HISTORY_PUSH,
  HISTORY_REPLACE,
  HistoryAction,
  POP,
  push,
  PUSH,
  replace,
  REPLACE,
  ROUTE_FOUND,
  ROUTE_NOT_FOUND,
  Router,
  RoutingAction,
} from "../lib";

describe("middleware", () => {

  describe("createRouterMiddleware()", () => {

    it("should subscribe router action and publish valid action", () => {
      const router = new Router();
      const key = router.route("/users/:user_id");
      const history = createMemoryHistory();
      const dispatch = 0;
      const next = 1;
      const cases: Array<{
        message: string,
        publishWith: number,
        action: ChangeAction | HistoryAction | RoutingAction,
      }> = [
        {
          message: "router can not find routing to initial location",
          publishWith: dispatch,
          action: {
            type: ROUTE_NOT_FOUND,
            payload: {
              action: PUSH,
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
            type: HISTORY_CHANGED,
            payload: {
              action: PUSH,
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
        },
        {
          message: "router can not find routing to push /users",
          publishWith: dispatch,
          action: {
            type: ROUTE_NOT_FOUND,
            payload: {
              action: PUSH,
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
            type: HISTORY_CHANGED,
            payload: {
              action: PUSH,
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
        },
        {
          message: "router can find routing to push /users/100",
          publishWith: dispatch,
          action: {
            type: ROUTE_FOUND,
            payload: {
              action: PUSH,
              result: {
                key,
                params: {
                  user_id: "100",
                },
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
            type: HISTORY_CHANGED,
            payload: {
              action: POP,
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
        },
        {
          message: "router can not find routing when back to /users",
          publishWith: dispatch,
          action: {
            type: ROUTE_NOT_FOUND,
            payload: {
              action: POP,
            },
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
            type: HISTORY_CHANGED,
            payload: {
              action: POP,
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
        },
        {
          message: "router can find routing when forward to /users/100",
          publishWith: dispatch,
          action: {
            type: ROUTE_FOUND,
            payload: {
              action: POP,
              result: {
                key,
                params: {
                  user_id: "100",
                },
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
            type: HISTORY_CHANGED,
            payload: {
              action: POP,
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
        },
        {
          message: "router can not find routing when go to /users",
          publishWith: dispatch,
          action: {
            type: ROUTE_NOT_FOUND,
            payload: {
              action: POP,
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
            type: HISTORY_CHANGED,
            payload: {
              action: POP,
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
        },
        {
          message: "router can find routing when go to /users/100",
          publishWith: dispatch,
          action: {
            type: ROUTE_FOUND,
            payload: {
              action: POP,
              result: {
                key,
                params: {
                  user_id: "100",
                },
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
            type: HISTORY_CHANGED,
            payload: {
              action: REPLACE,
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
        },
        {
          message: "router can find routing when replace to /users/200",
          publishWith: dispatch,
          action: {
            type: ROUTE_FOUND,
            payload: {
              action: REPLACE,
              result: {
                key,
                params: {
                  user_id: "200",
                },
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
            type: HISTORY_CHANGED,
            payload: {
              action: REPLACE,
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
        },
        {
          message: "router can not find routing when replace to /users",
          publishWith: dispatch,
          action: {
            type: ROUTE_NOT_FOUND,
            payload: {
              action: REPLACE,
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
            type: HISTORY_CHANGED,
            payload: {
              action: REPLACE,
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
        },
        {
          message: "router can find routing when replace to /users/300",
          publishWith: dispatch,
          action: {
            type: ROUTE_FOUND,
            payload: {
              action: REPLACE,
              result: {
                key,
                params: {
                  user_id: "300",
                },
              },
            },
          },
        },
      ];
      let i = 0;
      const entries = [];
      const act = createRouterMiddleware(router, history)({
        getState: () => {
          return {};
        },
        dispatch: (action) => {
          const a = action as (ChangeAction | HistoryAction | RoutingAction);
          const c = cases[i];
          if (a.type === HISTORY_CHANGED) {
            (c.action as HistoryAction).payload.entries = (a as HistoryAction).payload.entries;
            (c.action as HistoryAction).payload.location.key = (a as HistoryAction).payload.location.key;
          }
          strictEqual(c.publishWith, dispatch);
          deepStrictEqual(action, c.action, `dispatch: ${c.message}`);
          i++;
          return action;
        },
      })(
        (action) => {
          const c = cases[i];
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
          action: PUSH,
          index: 1,
          pathname: "/users",
          state: undefined,
        },
        {
          destinationAction: push("/users/100"),
          length: 3,
          action: PUSH,
          index: 2,
          pathname: "/users/100",
          state: undefined,
        },
        {
          destinationAction: goBack(),
          length: 3,
          action: POP,
          index: 1,
          pathname: "/users",
          state: undefined,
        },
        {
          destinationAction: goForward(),
          length: 3,
          action: POP,
          index: 2,
          pathname: "/users/100",
          state: undefined,
        },
        {
          destinationAction: go(-2),
          length: 3,
          action: POP,
          index:  0,
          pathname: "/",
          state: undefined,
        },
        {
          destinationAction: go(2),
          length: 3,
          action: POP,
          index:  2,
          pathname: "/users/100",
          state: undefined,
        },
        {
          destinationAction: replace("/users/200"),
          length: 3,
          action: REPLACE,
          index:  2,
          pathname: "/users/200",
          state: undefined,
        },
        {
          destinationAction: replace("/users"),
          length: 3,
          action: REPLACE,
          index:  2,
          pathname: "/users",
          state: undefined,
        },
        {
          destinationAction: replace("/users/300"),
          length: 3,
          action: REPLACE,
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

      strictEqual(i, cases.length);
    });

    it("should do nothing when unrelated action is passed", () => {
      const router = new Router();
      const history = createMemoryHistory();
      const act = createRouterMiddleware(router, history)({
        getState: () => {
          return {};
        },
        dispatch: (action) => action,
      })(
        (action) => {
          deepStrictEqual(action, {
            type: "unrelated",
          });
          return action;
        },
      );
      act({
        type: "unrelated",
      });
    });

  });

  describe("createStaticRouterMiddleware()", () => {

    it("should execute routing once and publish not found action", () => {
      const router = new Router();
      router.route("/users/:user_id");
      const cases: Array<{
        message: string,
        action: ChangeAction | HistoryAction | RoutingAction,
      }> = [
        {
          message: "router can not find routing for /users",
          action: {
            type: ROUTE_NOT_FOUND,
            payload: {
              action: PUSH,
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
      const key = router.route("/users/:user_id");
      const cases: Array<{
        message: string,
        action: ChangeAction | HistoryAction | RoutingAction,
      }> = [
        {
          message: "router can find routing for /users/100",
          action: {
            type: ROUTE_FOUND,
            payload: {
              action: PUSH,
              result: {
                key,
                params: {
                  user_id: "100",
                },
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

    it("should do nothing when unrelated action is passed", () => {
      const router = new Router();
      const history = createMemoryHistory();
      const act = createStaticRouterMiddleware(router, "/")({
        getState: () => {
          return {};
        },
        dispatch: (action) => action,
      })(
        (action) => {
          deepStrictEqual(action, {
            type: "unrelated",
          });
          return action;
        },
      );
      act({
        type: "unrelated",
      });
    });

  });

});
