import "mocha";
import {
  found,
  notFound,
  PUSH,
  reduceRouting,
} from "../lib";

describe("reduceRouting", () => {
  it("should be called with state and RouteAction", () => {
    reduceRouting({}, found(PUSH, "key", {}));
  });
});
