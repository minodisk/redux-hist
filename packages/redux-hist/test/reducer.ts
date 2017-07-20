import "mocha";
import {deepStrictEqual} from "power-assert";
import {Action} from "redux";

import {
  changed,
  found,
  History,
  notFound,
  PUSH,
  reduceHistory,
  reduceRouting,
  Routing,
} from "../lib";

describe("reducer", () => {

  describe("reduceHistory()", () => {
    [
      {
        message: "should ignore unrelated action",
        state: {
          action: PUSH,
          entries: [
            {
              hash: "baz",
              key: "abcde",
              pathname: "/foo",
              search: "bar",
              state: {
                qux: 100,
              },
            },
          ],
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
          action: PUSH,
          entries: [
            {
              hash: "baz",
              key: "abcde",
              pathname: "/foo",
              search: "bar",
              state: {
                qux: 100,
              },
            },
          ],
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
        action: changed({
          action: PUSH,
          entries: [
            {
              hash: "baz",
              key: "abcde",
              pathname: "/foo",
              search: "bar",
              state: {
                qux: 100,
              },
            },
          ],
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
        }),
        want: {
          action: PUSH,
          entries: [
            {
              hash: "baz",
              key: "abcde",
              pathname: "/foo",
              search: "bar",
              state: {
                qux: 100,
              },
            },
          ],
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
    ].forEach((c: {
      message: string,
      state: any,
      action: Action,
      want: History,
    }) => {
      it(c.message, () => {
        const got = reduceHistory(c.state, c.action);
        deepStrictEqual(got, c.want, c.message);
      });
    });
  });

  describe("reduceRouting()", () => {
    [
      {
        message: "should ignore unrelated action",
        state: {
          action: PUSH,
          result: {
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
          action: PUSH,
          result: {
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
        action: found(PUSH, {
          key: "/foo",
          params: {
            bar: "100",
          },
        }),
        want: {
          action: PUSH,
          result: {
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
        action: notFound(PUSH),
        want: {
          action: PUSH,
        },
      },
    ].forEach((c: {
      message: string,
      state: any,
      action: Action,
      want: Routing,
    }) => {
      it(c.message, () => {
        const got = reduceRouting(c.state, c.action);
        deepStrictEqual(got, c.want, c.message);
      });
    });
  });

});
