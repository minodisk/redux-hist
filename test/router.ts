import "mocha";
import * as assert from "power-assert";
import {
  PUSH,
  ROUTE_FOUND,
  ROUTE_NOT_FOUND,
  Router,
} from "../lib";

describe("Router", () => {

  describe("constructor()", () => {
    it("should be called without argument", () => {
      const router = new Router();
    });
  });

  describe("route()", () => {
    it("should be called with path", () => {
      const router = new Router();
      router.route("/users/:user_id");
    });
  });

  describe("exec()", () => {
    it("should be called with path", () => {
      const router = new Router();
      const key = router.route("/users/:user_id");
      const result = router.exec("/users/100");
      assert.deepStrictEqual(result, {
        key,
        params: {
          user_id: "100",
        },
      });
    });

    it("should be matched in order of calling route()", () => {
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
      ].forEach(({pathname, want}) => {
        const got = router.exec(pathname);
        assert.deepStrictEqual(got, want);
      });
    });
  });

});
