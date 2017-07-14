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
  RoutingAction,
} from "./action";

export interface Args {
  key: string;
  regexp: RegExp;
  keys: pathToRegexp.Key[];
}

export class Router {
  private mapper: {[path: string]: Args};

  constructor() {
    this.mapper = {};
  }

  public route(path: pathToRegexp.Path): string {
    const keys: pathToRegexp.Key[] = [];
    const regexp = pathToRegexp(path, keys);
    const key = regexp.toString();
    this.mapper[path.toString()] = {key, regexp, keys};
    return key;
  }

  public exec(action: Action, location: Pathname): RoutingAction {
    for (const path of Object.keys(this.mapper)) {
      const {key, regexp, keys} = this.mapper[path];
      const values = regexp.exec(location);
      if (values == null) {
        continue;
      }
      const params: Params = {};
      for (let i = 0; i < keys.length; i++) {
        params[keys[i].name] = values[i + 1];
      }
      return found(action, key, params);
    }
    return notFound(action);
  }
}
