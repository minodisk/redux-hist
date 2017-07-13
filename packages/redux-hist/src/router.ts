import {
  Action,
  History,
  LocationState,
  Pathname,
} from "history";
import * as pathToRegexp from "path-to-regexp";
import {
  found,
  notFound,
  Params,
  RouteAction,
} from "./action";

export interface Args {
  keys: pathToRegexp.Key[];
  regexp: RegExp;
}

export class Router {
  private mapper: {[path: string]: Args};

  constructor() {
    this.mapper = {};
  }

  public route(path: pathToRegexp.Path): void {
    const keys: pathToRegexp.Key[] = [];
    this.mapper[path.toString()] = {
      keys,
      regexp: pathToRegexp(path, keys),
    };
  }

  public run(action: Action, location: Pathname): RouteAction {
    for (const path of Object.keys(this.mapper)) {
      const {keys, regexp} = this.mapper[path];
      const values = regexp.exec(location);
      if (values == null) {
        continue;
      }
      const params: Params = {};
      for (let i = 0; i < keys.length; i++) {
        params[keys[i].name] = values[i + 1];
      }
      return found(action, params);
    }
    return notFound(action);
  }
}
