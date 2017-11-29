import "jest";
import { Action } from "redux";
import {
  changed,
  DiffAction,
  HistoryAction,
  PathAction,
  reduceHistory,
  reduceRoute,
  reduceStore,
  restore,
  RestoreAction,
  route,
  Route,
  RouteAction,
} from "../src";

describe("reduceHistory()", () => {
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
      action: changed("PUSH", 5, 10, {
        hash: "bazbaz",
        key: "abcdeabcde",
        pathname: "/foofoo",
        search: "barbar",
        state: {
          qux: 200,
        },
      }),
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
      action: HistoryAction;
      want: HistoryAction;
    }) => {
      it(c.name, () => {
        const got = reduceHistory(c.state, c.action);
        expect(got).toEqual(c.want);
      });
    },
  );
});

describe("reduceRoute()", () => {
  [
    {
      name: "should ignore unrelated action",
      state: {
        key: "/foo",
        params: {
          bar: "100",
        },
      },
      action: {
        type: "FOO",
        payload: {
          bar: 200,
        },
      },
      want: {
        key: "/foo",
        params: {
          bar: "100",
        },
      },
    },
    {
      name: "should return valid routing object when found",
      state: {},
      action: route({
        key: "/foo",
        params: {
          bar: "100",
        },
      }),
      want: {
        key: "/foo",
        params: {
          bar: "100",
        },
      },
    },
    {
      name: "should return valid routing object when not found",
      state: {},
      action: route(),
      want: null,
    },
  ].forEach(
    (c: { name: string; state: any; action: RouteAction; want: Route }) => {
      it(c.name, () => {
        const got = reduceRoute(c.state, c.action);
        expect(got).toEqual(c.want);
      });
    },
  );
});

describe("reduceStore()", () => {
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
  ].forEach(
    (c: {
      name: string;
      state: any;
      action: RestoreAction<any>;
      want: any;
    }) => {
      it(c.name, () => {
        const got = reduceStore(c.state, c.action);
        expect(got).toEqual(c.want);
      });
    },
  );
});
