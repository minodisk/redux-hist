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
  restore,
  RESTORE,
  Route,
  route,
  ROUTE_FOUND,
  ROUTE_NOT_FOUND,
  RouteAction,
} from "../src";

test("go() should be called with number", () => {
  expect(go(100)).toEqual({
    type: HISTORY_GO,
    diff: 100,
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

([
  {
    name: "route with action as POP and route without params",
    route: {
      key: "0",
      params: {},
    },
    want: {
      type: ROUTE_FOUND,
      route: {
        key: "0",
        params: {},
      },
    },
  },
  {
    name: "route with action as POP and route with params",
    route: {
      key: "1",
      params: {
        user_id: "100",
      },
    },
    want: {
      type: ROUTE_FOUND,
      route: {
        key: "1",
        params: {
          user_id: "100",
        },
      },
    },
  },
  {
    name: "route with action as PUSH and route without params",
    route: {
      key: "2",
      params: {},
    },
    want: {
      type: ROUTE_FOUND,
      route: {
        key: "2",
        params: {},
      },
    },
  },
  {
    name: "route with action as PUSH and route with params",
    route: {
      key: "3",
      params: {
        user_id: "100",
      },
    },
    want: {
      type: ROUTE_FOUND,
      route: {
        key: "3",
        params: {
          user_id: "100",
        },
      },
    },
  },
  {
    name: "route with action as REPLACE and route without params",
    route: {
      key: "4",
      params: {},
    },
    want: {
      type: ROUTE_FOUND,
      route: {
        key: "4",
        params: {},
      },
    },
  },
  {
    name: "route with action as REPLACE and route with params",
    route: {
      key: "5",
      params: {
        user_id: "100",
      },
    },
    want: {
      type: ROUTE_FOUND,
      route: {
        key: "5",
        params: {
          user_id: "100",
        },
      },
    },
  },
] as Array<{
  name: string;
  route: Route;
  want: RouteAction;
}>).forEach(c => {
  test(c.name, () => {
    const got = route(c.route);
    expect(got).toEqual(c.want);
  });
});

([
  {
    name: "route with action as POP and no route",
    want: {
      type: ROUTE_NOT_FOUND,
    },
  },
  {
    name: "route with action as PUSH and no route",
    want: {
      type: ROUTE_NOT_FOUND,
    },
  },
  {
    name: "route with action as REPLACE and no route",
    want: {
      type: ROUTE_NOT_FOUND,
    },
  },
] as Array<{
  name: string;
  want: RouteAction;
}>).forEach(c => {
  test(c.name, () => {
    const got = route();
    expect(got).toEqual(c.want);
  });
});

([
  {
    name: "restore with undefined store",
    store: undefined,
    want: {
      type: RESTORE,
      store: undefined,
    },
  },
  {
    name: "restore with null store",
    store: null,
    want: {
      type: RESTORE,
      store: null,
    },
  },
  {
    name: "restore with empty object",
    store: {},
    want: {
      type: RESTORE,
      store: {},
    },
  },
  {
    name: "restore with fullfilled object",
    store: {
      users: [{ userID: 1 }, { userID: 2 }],
      posts: [{ postID: 1 }, { postID: 2 }],
    },
    want: {
      type: RESTORE,
      store: {
        users: [{ userID: 1 }, { userID: 2 }],
        posts: [{ postID: 1 }, { postID: 2 }],
      },
    },
  },
] as Array<{
  name: string;
  store: any;
  want: any;
}>).forEach(c => {
  test(c.name, expect(restore(c.store)).toEqual(c.want));
});
