import { createMemoryHistory } from "history";
import "jest";
import { applyMiddleware, compose, createStore, Middleware } from "redux";
import {
  changed,
  createHistoryMiddleware,
  createRestoreMiddleware,
  createRouterMiddleware,
  createStaticRouterMiddleware,
  go,
  goBack,
  goForward,
  History,
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
  RESTORE,
  RestoreAction,
  ROUTE_FOUND,
  ROUTE_NOT_FOUND,
  RouteAction,
  Router,
  State,
} from "../src";

describe("createRestoreMiddleware()", () => {
  describe("dispatch restore action when it is initialized", () => {
    ([
      {
        name: "without state",
        state: null,
        want: null,
      },
      {
        name: "without store",
        state: { store: null },
        want: null,
      },
      {
        name: "with store",
        state: { store: { foo: 100 } },
        want: {
          type: RESTORE,
          store: { foo: 100 },
        },
      },
    ] as Array<{
      name: string;
      state: any;
      want: RestoreAction<{}>;
    }>).forEach(c => {
      describe(c.name, () => {
        const history = createMemoryHistory();
        const onRequestShrinkStore = jest.fn((s: any): any => s);
        const onBeforeSavingStore = jest.fn((s: any): any => s);
        const middleware = createRestoreMiddleware(
          history,
          onRequestShrinkStore,
          onBeforeSavingStore,
        );
        const store = {
          getState: jest.fn(() => {
            return {};
          }),
          dispatch: jest.fn(),
        };
        middleware(store);
        history.push("/foo", c.state);
        if (c.want == null) {
          it("shouldn't dispatch any action", () => {
            expect(store.dispatch).not.toBeCalled();
          });
        } else {
          it("should dispatch restore action", () => {
            expect(store.dispatch).toBeCalledWith(c.want);
          });
        }
      });
    });
  });

  describe("dispatch restore action when location is changed", () => {
    ([
      {
        name: "routed path",
        action: push("/foo"),
        initial: { description: "initial" },
        before: { description: "customized in before callback" },
        shrinked: { description: "shrinked in request shrink callback" },
        want: {
          store: { description: "customized in before callback" },
        },
      },
    ] as Array<{
      name: string;
      action: PathAction;
      initial: any;
      before: any;
      shrinked: any;
      want: State<any, any>;
    }>).forEach(c => {
      describe(c.name, () => {
        const history = createMemoryHistory();
        const onRequestShrinkStore = jest.fn(s => c.shrinked);
        const onBeforeSavingStore = jest.fn(s => c.before);
        const middleware = createRestoreMiddleware(
          history,
          onRequestShrinkStore,
          onBeforeSavingStore,
        );
        const store = {
          getState: jest.fn(() => c.initial),
          dispatch: jest.fn(),
        };
        const next = jest.fn();
        const invoke = middleware(store)(next);
        // store.dispatch.mockReset();

        expect(onRequestShrinkStore).not.toBeCalled();
        expect(onBeforeSavingStore).not.toBeCalled();
        expect(store.dispatch).not.toBeCalled();

        invoke(c.action);

        it("onBeforeSavingStore() should be called", () => {
          expect(onBeforeSavingStore).toBeCalledWith(c.initial);
        });

        it("location state should be replaced with new state", () => {
          expect(history.location.state).toEqual(c.want);
        });

        it("shouldn't dispatch because location replaced internally", () => {
          expect(store.dispatch).not.toBeCalled();
        });
      });
    });
  });
});

describe("createHistoryMiddleware()", () => {
  const history = createMemoryHistory();
  const historyMiddleware = createHistoryMiddleware(history);
  const store = {
    getState: jest.fn(() => {
      return {};
    }),
    dispatch: jest.fn(),
  };
  const next = jest.fn();
  const invoke = action => historyMiddleware(store)(next)(action);

  ([
    {
      name: "push /users-old",
      action: push("/users-old"),
      want: {
        action: "PUSH",
        index: 1,
        length: 2,
        location: {
          pathname: "/users-old",
          search: "",
          hash: "",
          state: { store: undefined },
        },
      },
    },
    {
      name: "replace /users",
      action: replace("/users"),
      want: {
        action: "REPLACE",
        index: 1,
        length: 2,
        location: {
          pathname: "/users",
          search: "",
          hash: "",
          state: { store: undefined },
        },
      },
    },
    {
      name: "push /users/100",
      action: push("/users/100"),
      want: {
        action: "PUSH",
        index: 2,
        length: 3,
        location: {
          pathname: "/users/100",
          search: "",
          hash: "",
          state: { store: undefined },
        },
      },
    },
    {
      name: "go back one step",
      action: goBack(),
      want: {
        action: "POP",
        index: 1,
        length: 3,
        location: {
          pathname: "/users",
          search: "",
          hash: "",
          state: { store: undefined },
        },
      },
    },
    {
      name: "go forward one step",
      action: goForward(),
      want: {
        action: "POP",
        index: 2,
        length: 3,
        location: {
          pathname: "/users/100",
          search: "",
          hash: "",
          state: { store: undefined },
        },
      },
    },
    {
      name: "go back two step",
      action: go(-2),
      want: {
        action: "POP",
        index: 0,
        length: 3,
        location: {
          pathname: "/",
          search: "",
          hash: "",
          state: undefined,
        },
      },
    },
    {
      name: "go forward two step",
      action: go(2),
      want: {
        action: "POP",
        index: 2,
        length: 3,
        location: {
          pathname: "/users/100",
          search: "",
          hash: "",
          state: { store: undefined },
        },
      },
    },
  ] as Array<{
    name: string;
    action: PathAction;
    want: History;
  }>).forEach(c => {
    it(c.name, () => {
      invoke(c.action);
      expect(next).toBeCalledWith(c.action); // action shouldn't be altered
      expect(history.action).toBe(c.want.action);
      expect(history.index).toBe(c.want.index);
      expect(history.length).toBe(c.want.length);
      c.want.location.key = history.location.key;
      expect(history.location).toEqual(c.want.location);
    });
  });
});

describe("createHistoryMiddleware()", () => {
  const history = createMemoryHistory();
  const historyMiddleware = createHistoryMiddleware(history);
  const store = {
    getState: jest.fn(() => {
      return {};
    }),
    dispatch: jest.fn(),
  };
  const next = jest.fn();
  const invoke = a => historyMiddleware(store)(next)(a);

  const { action, index, length, location } = history;
  const loc = { ...location };
  ([
    {
      name: "do nothing with unrelated action",
      action: { type: "UNRELATED" },
    },
  ] as Array<{
    name: string;
    action: Action;
    want: History;
  }>).forEach(c => {
    it(c.name, () => {
      invoke(c.action);
      expect(next).toBeCalledWith(c.action); // action shouldn't be altered
      expect(history.action).toBe(action);
      expect(history.index).toBe(index);
      expect(history.length).toBe(length);
      expect(history.location).toEqual(loc);
    });
  });
});

describe("createRouterMiddleware()", () => {
  describe("dispatch route action when it is initialized", () => {
    ([
      {
        name: "with routed path",
        path: "/",
        want: {
          type: ROUTE_FOUND,
          route: {
            params: {},
          },
        },
      },
      {
        name: "without routed path",
        path: "/users",
        want: {
          type: ROUTE_NOT_FOUND,
        },
      },
    ] as Array<{
      name: string;
      path: string;
      want: RouteAction;
    }>).forEach(c => {
      describe(c.name, () => {
        const router = new Router();
        const key = router.route(c.path);
        const history = createMemoryHistory();
        const middleware = createRouterMiddleware(history, router);
        const store = {
          getState: jest.fn(() => {
            return {};
          }),
          dispatch: jest.fn(),
        };
        middleware(store);
        it("should be dispatch route action with initial location", () => {
          if (c.want.route != null) {
            c.want.route.key = key;
          }
          expect(store.dispatch).toBeCalledWith(c.want);
        });
      });
    });
  });

  describe("dispatch route action when location is changed", () => {
    const router = new Router();
    const key = router.route("/users/:user_id");
    ([
      {
        name: "routed path",
        path: "/users/100",
        state: null,
        want: {
          type: ROUTE_FOUND,
          route: {
            key,
            params: {
              user_id: "100",
            },
          },
        },
      },
      {
        name: "not routed path",
        path: "/users",
        state: null,
        want: {
          type: ROUTE_NOT_FOUND,
        },
      },
      // {
      //   name: "routed path internally",
      //   path: "/users/100",
      //   state: { internal: true },
      // },
      // {
      //   name: "not routed path internally",
      //   path: "/users",
      //   state: { internal: true },
      // },
    ] as Array<{
      name: string;
      path: string;
      state: any;
      want: RouteAction;
    }>).forEach(c => {
      describe(c.name, () => {
        const history = createMemoryHistory();
        const middleware = createRouterMiddleware(history, router);
        const store = {
          getState: jest.fn(() => {
            return {};
          }),
          dispatch: jest.fn(),
        };
        const next = jest.fn();
        const invoke = middleware(store)(next);
        store.dispatch.mockReset();
        history.push(c.path, c.state);

        // if (c.state != null && c.state.internal) {
        //   it("shouldn't dispatch", () => {
        //     expect(store.dispatch).not.toBeCalled();
        //   });
        // } else {
        it("should dispatch", () => {
          expect(store.dispatch).toBeCalledWith(c.want);
        });
        // }

        it("shouldn't alter action", () => {
          const a = { type: "FOO" };
          invoke(a);
          expect(next).toBeCalledWith(a);
        });
      });
    });
  });
});

describe("createStaticRouterMiddleware()", () => {
  ([
    {
      name: "routed path",
      path: "/users/100",
      want: {
        type: ROUTE_FOUND,
        route: {
          params: {
            user_id: "100",
          },
        },
      },
    },
    {
      name: "not routed path",
      path: "/users",
      want: {
        type: ROUTE_NOT_FOUND,
      },
    },
  ] as Array<{
    name: string;
    path: string;
    want: RouteAction;
  }>).forEach(c => {
    describe(c.name, () => {
      const router = new Router();
      const key = router.route("/users/:user_id");
      const store = {
        getState: jest.fn(() => {
          return {};
        }),
        dispatch: jest.fn(),
      };
      const next = jest.fn();
      const invoke = createStaticRouterMiddleware(c.path, router)(store)(next);
      it("should dispatch route action", () => {
        if (c.want.route != null) {
          c.want.route.key = key;
        }
        expect(store.dispatch).toBeCalledWith(c.want);
      });
      it("shouldn't alter unrelated action: " + c.name, () => {
        const a = { type: "FOO" };
        invoke(a);
        expect(next).toBeCalledWith(a);
      });
    });
  });
});
