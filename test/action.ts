import { Action as HistoryAction } from "history";
import "jest";
import {
  go,
  goBack,
  goForward,
  HISTORY_GO,
  HISTORY_GO_BACK,
  HISTORY_GO_FORWARD,
  HistoryActionType,
  push,
  replace,
  Route,
  route,
  ROUTE_FOUND,
  ROUTE_NOT_FOUND,
  RouteAction,
} from "../src";

test("go() should be called with number", () => {
  expect(go(100)).toEqual({
    type: HISTORY_GO,
    payload: 100,
  });
});

test("back() should be called without argument", () => {
  expect(goBack()).toEqual({
    type: HISTORY_GO_BACK,
  });
});

test("goForward() should be called without argument", () => {
  expect(goForward()).toEqual({
    type: HISTORY_GO_FORWARD,
  });
});

test("push() should be called with Path", () => {
  push("/users/100");
});
test("should be called with Path and LocationState", () => {
  push("/users/100", { scrollTop: 200 });
});

test("replace() should be called with Path", () => {
  replace("/users/100");
});
test("should be called with Path and LocationState", () => {
  replace("/users/100", { scrollTop: 200 });
});

test("route() with Route should return ROUTE_FOUND action", () => {
  ([
    {
      message: "POP with empty params",
      action: "POP",
      route: {
        key: "0",
        params: {},
      },
      want: {
        type: ROUTE_FOUND,
        action: "POP",
        route: {
          key: "0",
          params: {},
        },
      },
    },
    {
      message: "POP with params",
      action: "POP",
      route: {
        key: "1",
        params: {
          user_id: "100",
        },
      },
      want: {
        type: ROUTE_FOUND,
        action: "POP",
        route: {
          key: "1",
          params: {
            user_id: "100",
          },
        },
      },
    },
    {
      message: "PUSH with empty params",
      action: "PUSH",
      route: {
        key: "2",
        params: {},
      },
      want: {
        type: ROUTE_FOUND,
        action: "PUSH",
        route: {
          key: "2",
          params: {},
        },
      },
    },
    {
      message: "PUSH with params",
      action: "PUSH",
      route: {
        key: "3",
        params: {
          user_id: "100",
        },
      },
      want: {
        type: ROUTE_FOUND,
        action: "PUSH",
        route: {
          key: "3",
          params: {
            user_id: "100",
          },
        },
      },
    },
    {
      message: "REPLACE with empty params",
      action: "REPLACE",
      route: {
        key: "4",
        params: {},
      },
      want: {
        type: ROUTE_FOUND,
        action: "REPLACE",
        route: {
          key: "4",
          params: {},
        },
      },
    },
    {
      message: "REPLACE with params",
      action: "REPLACE",
      route: {
        key: "5",
        params: {
          user_id: "100",
        },
      },
      want: {
        type: ROUTE_FOUND,
        action: "REPLACE",
        route: {
          key: "5",
          params: {
            user_id: "100",
          },
        },
      },
    },
  ] as Array<{
    message: string;
    action: HistoryActionType;
    route: Route;
    want: RouteAction;
  }>).forEach(c => {
    test(c.message, () => {
      const got = route(c.action, c.route);
      expect(got).toEqual(c.want);
    });
  });
});

test("route() without Route should return ROUTE_NOT_FOUND action", () => {
  ([
    {
      message: "POP",
      action: "POP",
      want: {
        type: ROUTE_NOT_FOUND,
        action: "POP",
      },
    },
    {
      message: "PUSH",
      action: "PUSH",
      want: {
        type: ROUTE_NOT_FOUND,
        action: "PUSH",
      },
    },
    {
      message: "REPLACE",
      action: "REPLACE",
      want: {
        type: ROUTE_NOT_FOUND,
        action: "REPLACE",
      },
    },
  ] as Array<{
    message: string;
    action: HistoryActionType;
    want: RouteAction;
  }>).forEach(c => {
    test(c.message, () => {
      const got = route(c.action);
      expect(got).toEqual(c.want);
    });
  });
});
