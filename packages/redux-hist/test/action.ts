import "mocha";
import {
  deepStrictEqual,
} from "power-assert";
import {
  back,
  forward,
  found,
  go,
  HISTORY_BACK,
  HISTORY_FORWARD,
  HISTORY_GO,
  notFound,
  POP,
  push,
  PUSH,
  replace,
  REPLACE,
  ROUTE_FOUND,
  ROUTE_NOT_FOUND,
  RouteAction,
} from "redux-router";

describe("found", () => {
  it("should return ROUTE_FOUND action", () => {
    for (const c of [
      {
        message: "POP with empty params",
        action: POP,
        params: {},
        want: {
          type: ROUTE_FOUND,
          payload: {
            action: POP,
            params: {},
          },
        },
      },
      {
        message: "POP with params",
        action: POP,
        params: {
          user_id: "100",
        },
        want: {
          type: ROUTE_FOUND,
          payload: {
            action: POP,
            params: {
              user_id: "100",
            },
          },
        },
      },
      {
        message: "PUSH with empty params",
        action: PUSH,
        params: {},
        want: {
          type: ROUTE_FOUND,
          payload: {
            action: PUSH,
            params: {},
          },
        },
      },
      {
        message: "PUSH with params",
        action: PUSH,
        params: {
          user_id: "100",
        },
        want: {
          type: ROUTE_FOUND,
          payload: {
            action: PUSH,
            params: {
              user_id: "100",
            },
          },
        },
      },
      {
        message: "REPLACE with empty params",
        action: REPLACE,
        params: {},
        want: {
          type: ROUTE_FOUND,
          payload: {
            action: REPLACE,
            params: {},
          },
        },
      },
      {
        message: "REPLACE with params",
        action: REPLACE,
        params: {
          user_id: "100",
        },
        want: {
          type: ROUTE_FOUND,
          payload: {
            action: REPLACE,
            params: {
              user_id: "100",
            },
          },
        },
      },
    ]) {
      const got = found(c.action, c.params);
      deepStrictEqual(got, c.want, c.message);
    }
  });
});

describe("go", () => {
  it("should be called with number", () => {
    deepStrictEqual(go(100), {
      type: HISTORY_GO,
      payload: 100,
    });
  });
});

describe("back", () => {
  it("should be called without argument", () => {
    deepStrictEqual(back(), {
      type: HISTORY_BACK,
    });
  });
});

describe("goForward", () => {
  it("should be called without argument", () => {
    deepStrictEqual(forward(), {
      type: HISTORY_FORWARD,
    });
  });
});

describe("notFound", () => {
  it("should return ROUTE_NOT_FOUND action", () => {
    for (const c of [
      {
        message: "POP",
        action: POP,
        want: {
          type: ROUTE_NOT_FOUND,
          payload: {
            action: POP,
          },
        },
      },
      {
        message: "PUSH",
        action: PUSH,
        want: {
          type: ROUTE_NOT_FOUND,
          payload: {
            action: PUSH,
          },
        },
      },
      {
        message: "REPLACE",
        action: REPLACE,
        want: {
          type: ROUTE_NOT_FOUND,
          payload: {
            action: REPLACE,
          },
        },
      },
    ]) {
      const got = notFound(c.action);
      deepStrictEqual(got, c.want, c.message);
    }
  });
});

describe("push", () => {
  it("should be called with Path", () => {
    push("/users/100");
  });
  it("should be called with Path and LocationState", () => {
    push("/users/100", { scrollTop: 200 });
  });
});

describe("replace", () => {
  it("should be called with Path", () => {
    replace("/users/100");
  });
  it("should be called with Path and LocationState", () => {
    replace("/users/100", { scrollTop: 200 });
  });
});
