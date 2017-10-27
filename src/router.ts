import { Pathname } from "history";
import * as pathToRegexp from "path-to-regexp";

export type Key = string;

export interface Args {
  key: Key;
  regexp: RegExp;
  keys: pathToRegexp.Key[];
}

export interface Params {
  [name: string]: string;
}

export interface Route {
  key: Key;
  params: Params;
}

export class Router {
  private routes: Args[];

  constructor() {
    this.routes = [];
  }

  public route(path: pathToRegexp.Path): Key {
    const keys: pathToRegexp.Key[] = [];
    const regexp = pathToRegexp(path, keys);
    const key = regexp.toString();
    this.routes.push({ key, regexp, keys });
    return key;
  }

  public exec(location: Pathname): Route {
    for (const { key, regexp, keys } of this.routes) {
      const values = regexp.exec(location);
      if (values == null) {
        continue;
      }
      const params: Params = {};
      for (let i = 0; i < keys.length; i++) {
        params[keys[i].name] = values[i + 1];
      }
      return { key, params };
    }
    return null;
  }
}
