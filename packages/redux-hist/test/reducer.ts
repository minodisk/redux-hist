import "mocha";
import {
  found,
  notFound,
  reduceRouting,
} from "redux-router";

describe("reduceRouting", () => {
  it("should be called with state and RouteAction", () => {
    reduceRouting({}, found("PUSH", {}));
  });
});
