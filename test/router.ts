import "jest";
import { ROUTE_FOUND, ROUTE_NOT_FOUND, Router } from "../src";

test("Router.constructor() should be called without argument", () => {
  const router = new Router();
});

test("Router.prototype.route() should be called with path", () => {
  const router = new Router();
  router.route("/users/:user_id");
});

test("Router.prototype.exec() should be called with path", () => {
  const router = new Router();
  const key = router.route("/users/:user_id");
  const result = router.exec("/users/100");
  expect(result).toEqual({
    key,
    params: {
      user_id: "100",
    },
  });
});

test("Router.prototype.exec() should be matched in order of calling route()", () => {
  const router = new Router();
  const users = router.route("/users");
  const me = router.route("/users/me");
  const id = router.route("/users/:user_id");
  [
    {
      pathname: "/users",
      want: {
        key: users,
        params: {},
      },
    },
    {
      pathname: "/users/me",
      want: {
        key: me,
        params: {},
      },
    },
    {
      pathname: "/users/you",
      want: {
        key: id,
        params: {
          user_id: "you",
        },
      },
    },
    {
      pathname: "/users/100",
      want: {
        key: id,
        params: {
          user_id: "100",
        },
      },
    },
  ].forEach(({ pathname, want }) => {
    const got = router.exec(pathname);
    expect(got).toEqual(want);
  });
});
