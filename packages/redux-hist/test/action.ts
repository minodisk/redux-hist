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
} from "../lib";

describe("found", () => {
  it("should return ROUTE_FOUND action", () => {
    for (const c of [
      {
        message: "POP with empty params",
        action: POP,
        key: "0",
        params: {},
        want: {
          type: ROUTE_FOUND,
          payload: {
            action: POP,
            key: "0",
            params: {},
          },
        },
      },
      {
        message: "POP with params",
        action: POP,
        key: "1",
        params: {
          user_id: "100",
        },
        want: {
          type: ROUTE_FOUND,
          payload: {
            action: POP,
            key: "1",
            params: {
              user_id: "100",
            },
          },
        },
      },
      {
        message: "PUSH with empty params",
        action: PUSH,
        key: "2",
        params: {},
        want: {
          type: ROUTE_FOUND,
          payload: {
            action: PUSH,
            key: "2",
            params: {},
          },
        },
      },
      {
        message: "PUSH with params",
        action: PUSH,
        key: "3",
        params: {
          user_id: "100",
        },
        want: {
          type: ROUTE_FOUND,
          payload: {
            action: PUSH,
            key: "3",
            params: {
              user_id: "100",
            },
          },
        },
      },
      {
        message: "REPLACE with empty params",
        action: REPLACE,
        key: "4",
        params: {},
        want: {
          type: ROUTE_FOUND,
          payload: {
            action: REPLACE,
            key: "4",
            params: {},
          },
        },
      },
      {
        message: "REPLACE with params",
        action: REPLACE,
        key: "5",
        params: {
          user_id: "100",
        },
        want: {
          type: ROUTE_FOUND,
          payload: {
            action: REPLACE,
            key: "5",
            params: {
              user_id: "100",
            },
          },
        },
      },
    ]) {
      const got = found(c.action, c.key, c.params);
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
