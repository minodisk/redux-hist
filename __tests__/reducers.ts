import "jest";
import { Action } from "redux";
import {
  changed,
  LocationAction,
  LocationProps,
  reduceLocation,
  reduceRoute,
  reduceStore,
  restore,
  route,
  RouteAction,
  RouteProps,
} from "../src";

[
  {
    name: "should ignore unrelated action",
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
    name: "should return changed action's payload",
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
    name: string;
    state: any;
    action: Action | LocationAction;
    want: LocationProps;
  }) => {
    test(`reduceLocation() ${c.name}`, () => {
      const got = reduceLocation(c.state, c.action);
      expect(got).toEqual(c.want);
    });
  },
);

[
  {
    name: "should ignore unrelated action",
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
    name: "should return valid routing object when found",
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
    name: "should return valid routing object when not found",
    state: {},
    action: route("PUSH"),
    want: {
      action: "PUSH",
    },
  },
].forEach(
  (c: { name: string; state: any; action: RouteAction; want: RouteProps }) => {
    test(`reduceRoute() ${c.name}`, () => {
      const got = reduceRoute(c.state, c.action);
      expect(got).toEqual(c.want);
    });
  },
);

[
  {
    name: "should ignore unrelated action",
    state: { a: 1 },
    action: {
      type: "FOO",
      store: { a: 2 },
    },
    want: { a: 1 },
  },
  {
    name: "should return new store",
    state: { a: 1 },
    action: restore({ b: 2 }),
    want: { b: 2 },
  },
].forEach((c: { name: string; state: any; action: RestoreAction<any> }) => {
  test(`reduceStore() ${c.name}`, () => {
    const got = reduceStore(c.state, c.action);
    expect(got).toEqual(c.want);
  });
});
