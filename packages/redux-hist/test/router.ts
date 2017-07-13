import "mocha";
import {
  deepStrictEqual,
  notDeepStrictEqual,
  notStrictEqual,
  strictEqual,
} from "power-assert";
import {Router} from "redux-router";

describe("Router", () => {
  describe("new", () => {
    it("should be called without argument", () => {
      const router = new Router();
    });
  });
  describe("route", () => {
    it("should be called with path", () => {
      const router = new Router();
      router.route("/users/:user_id");
    });
  });
  describe("exec", () => {
    it("should be called with path", () => {
      const router = new Router();
      router.run("PUSH", "/users/100");
    });
  });
});
