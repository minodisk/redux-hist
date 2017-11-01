import "jest";
import { Action } from "redux";
import {
  changed,
  LocationAction,
  LocationProps,
  reduceLocation,
  reduceRoute,
  route,
  RouteAction,
  RouteProps,
} from "../src";

[
  {
    message: "should ignore unrelated action",
    state: {
      action: "PUSH",
      index: 5,
      length: 10,
      location: {
        hash: "bazbaz",
        key: "abcdeabcde",
        pathname: "/foofoo",
        search: "barbar",
        state: {
          qux: 200,
        },
      },
    },
    action: {
      type: "FOO",
      payload: {
        bar: 200,
      },
    },
    want: {
      action: "PUSH",
      index: 5,
      length: 10,
      location: {
        hash: "bazbaz",
        key: "abcdeabcde",
        pathname: "/foofoo",
        search: "barbar",
        state: {
          qux: 200,
        },
      },
    },
  },
  {
    message: "should return changed action's payload",
    state: {},
    action: changed(
      "PUSH",
      5,
      10,
      {
        hash: "bazbaz",
        key: "abcdeabcde",
        pathname: "/foofoo",
        search: "barbar",
        state: {
          qux: 200,
        },
      },
      {},
    ),
    want: {
      action: "PUSH",
      index: 5,
      length: 10,
      location: {
        hash: "bazbaz",
        key: "abcdeabcde",
        pathname: "/foofoo",
        search: "barbar",
        state: {
          qux: 200,
        },
      },
    },
  },
].forEach(
  (c: {
    message: string;
    state: any;
    action: Action | LocationAction;
    want: LocationProps;
  }) => {
    test("reduceLocation() " + c.message, () => {
      const got = reduceLocation(c.state, c.action);
      expect(got).toEqual(c.want);
    });
  },
);

[
  {
    message: "should ignore unrelated action",
    state: {
      action: "PUSH",
      route: {
        key: "/foo",
        params: {
          bar: "100",
        },
      },
    },
    action: {
      type: "FOO",
      payload: {
        bar: 200,
      },
    },
    want: {
      action: "PUSH",
      route: {
        key: "/foo",
        params: {
          bar: "100",
        },
      },
    },
  },
  {
    message: "should returns valid routing object when found",
    state: {},
    action: route("PUSH", {
      key: "/foo",
      params: {
        bar: "100",
      },
    }),
    want: {
      action: "PUSH",
      route: {
        key: "/foo",
        params: {
          bar: "100",
        },
      },
    },
  },
  {
    message: "should returns valid routing object when not found",
    state: {},
    action: route("PUSH"),
    want: {
      action: "PUSH",
    },
  },
].forEach(
  (c: {
    message: string;
    state: any;
    action: RouteAction;
    want: RouteProps;
  }) => {
    test("reduceRoute() " + c.message, () => {
      const got = reduceRoute(c.state, c.action);
      expect(got).toEqual(c.want);
    });
  },
);
