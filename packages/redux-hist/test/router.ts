import "mocha";
import {
  deepStrictEqual,
  notDeepStrictEqual,
  notStrictEqual,
  strictEqual,
} from "power-assert";
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
      deepStrictEqual(result, {
        key,
        params: {
          user_id: "100",
        },
      });
    });
  });

});
