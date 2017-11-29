import { createMemoryHistory } from "history";
import "jest";
import {
  Action,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Middleware,
} from "redux";
import {
  changed,
  createHistoryMiddleware,
  createRestoreMiddleware,
  createRouterMiddleware,
  go,
  goBack,
  goForward,
  History,
  HISTORY_GO,
  HISTORY_GO_BACK,
  HISTORY_GO_FORWARD,
  HISTORY_PUSH,
  HISTORY_REPLACE,
  HistoryAction,
  LOCATION_CHANGED,
  LocationAction,
  PathAction,
  push,
  reduceLocation,
  reduceRoute,
  reduceStore,
  replace,
  RESTORE,
  ROUTE_FOUND,
  ROUTE_NOT_FOUND,
  RouteAction,
  Router,
} from "../src";

interface Store {
  history: History;
  route: any;
  users: any;
  user: any;
  posts: any;
  post: any;
}

const USERS = "USERS";
const USER = "USER";
const POSTS = "POSTS";
const POST = "POST";

const users = data => {
  return {
    type: USERS,
    users: data,
  };
};
const user = data => {
  return {
    type: USER,
    user: data,
  };
};
const posts = data => {
  return {
    type: USERS,
    posts: data,
  };
};
const post = data => {
  return {
    type: USERS,
    post: data,
  };
};

describe("store middleware's scenario", () => {
  const history = createMemoryHistory();
  const router = new Router();
  const usersKey = router.route("/users");
  const userKey = router.route("/users/:user_id");
  const postKey = router.route("/posts/:post_id");
  const restoreMiddleware = createRestoreMiddleware(
    history,
    store => {
      return store;
    },
    store => {
      return store;
    },
  );
  const historyMiddleware = createHistoryMiddleware(history);
  const routerMiddleware = createRouterMiddleware(history, router);
  const childReducer = combineReducers({
    history: reduceLocation,
    route: reduceRoute,
    users: (store = {}, action) => {
      switch (action.type) {
        case USERS:
          return action.users;
        default:
          return store;
      }
    },
    user: (store = {}, action) => {
      switch (action.type) {
        case USER:
          return action.user;
        default:
          return store;
      }
    },
    posts: (store = {}, action) => {
      switch (action.type) {
        case POSTS:
          return action.posts;
        default:
          return store;
      }
    },
    post: (store = {}, action) => {
      switch (action.type) {
        case POST:
          return action.post;
        default:
          return store;
      }
    },
  });
  const reducer = (store, action) => {
    switch (action.type) {
      case RESTORE:
        return action.store;
      default:
        return childReducer(store, action);
    }
  };
  const { dispatch, getState } = createStore(
    reducer,
    applyMiddleware(restoreMiddleware, historyMiddleware, routerMiddleware),
  );

  ([
    {
      name: "push /users",
      action: push("/users", { foo: "foo!" }),
      want: {
        history: {
          action: "PUSH",
          index: 1,
          length: 2,
          location: {
            pathname: "/users",
            search: "",
            hash: "",
            state: { foo: "foo!" },
          },
        },
        route: {
          key: usersKey,
          params: {},
        },
        users: {},
        user: {},
        posts: {},
        post: {},
      },
    },
    {
      name: "got users",
      action: users([
        { user_id: 0 },
        { user_id: 1 },
        { user_id: 2 },
        { user_id: 3 },
      ]),
      want: {
        history: {
          action: "PUSH",
          index: 1,
          length: 2,
          location: {
            pathname: "/users",
            search: "",
            hash: "",
            state: { foo: "foo!" },
          },
        },
        route: {
          key: usersKey,
          params: {},
        },
        users: [{ user_id: 0 }, { user_id: 1 }, { user_id: 2 }, { user_id: 3 }],
        user: {},
        posts: {},
        post: {},
      },
    },
    {
      name: "push /users/100",
      action: push("/users/100", { bar: "bar!" }),
      want: {
        history: {
          action: "PUSH",
          index: 2,
          length: 3,
          location: {
            pathname: "/users/100",
            search: "",
            hash: "",
            state: { foo: "foo!", bar: "bar!" },
          },
        },
        route: {
          key: userKey,
          params: { user_id: "100" },
        },
        users: [{ user_id: 0 }, { user_id: 1 }, { user_id: 2 }, { user_id: 3 }],
        user: {},
        posts: {},
        post: {},
      },
    },
    {
      name: "got user 100",
      action: user({ user_id: 100 }),
      want: {
        history: {
          action: "PUSH",
          index: 2,
          length: 3,
          location: {
            pathname: "/users/100",
            search: "",
            hash: "",
            state: { foo: "foo!", bar: "bar!" },
          },
        },
        route: {
          key: userKey,
          params: { user_id: "100" },
        },
        users: [{ user_id: 0 }, { user_id: 1 }, { user_id: 2 }, { user_id: 3 }],
        user: { user_id: 100 },
        posts: {},
        post: {},
      },
    },
    {
      name: "go back 1 step to /users",
      action: goBack(),
      want: {
        history: {
          action: "POP",
          index: 1,
          length: 3,
          location: {
            pathname: "/users",
            search: "",
            hash: "",
            state: { foo: "foo!" },
          },
        },
        route: { key: usersKey, params: {} },
        users: [{ user_id: 0 }, { user_id: 1 }, { user_id: 2 }, { user_id: 3 }],
        user: {},
        posts: {},
        post: {},
      },
    },
    {
      name: "go forward 1 step to /users/100",
      action: goForward(),
      want: {
        history: {
          action: "POP",
          index: 2,
          length: 3,
          location: {
            pathname: "/users/100",
            search: "",
            hash: "",
            state: { foo: "foo!", bar: "bar!" },
          },
        },
        route: {
          key: userKey,
          params: { user_id: "100" },
        },
        users: [{ user_id: 0 }, { user_id: 1 }, { user_id: 2 }, { user_id: 3 }],
        user: { user_id: 100 },
        posts: {},
        post: {},
      },
    },
    {
      name: "go back 2 steps to /",
      action: go(-2),
      want: {
        history: {
          action: "POP",
          index: 0,
          length: 3,
          location: {
            pathname: "/",
            search: "",
            hash: "",
            state: undefined,
          },
        },
        route: null,
        users: {},
        user: {},
        posts: {},
        post: {},
      },
    },
    {
      name: "go forward 2 steps to /users/100",
      action: go(2),
      want: {
        history: {
          action: "POP",
          index: 2,
          length: 3,
          location: {
            pathname: "/users/100",
            search: "",
            hash: "",
            state: { foo: "foo!", bar: "bar!" },
          },
        },
        route: {
          key: userKey,
          params: { user_id: "100" },
        },
        users: [{ user_id: 0 }, { user_id: 1 }, { user_id: 2 }, { user_id: 3 }],
        user: { user_id: 100 },
        posts: {},
        post: {},
      },
    },
    {
      name: "replace to /users/200",
      action: replace("/users/200"),
      want: {
        history: {
          action: "REPLACE",
          index: 2,
          length: 3,
          location: {
            pathname: "/users/200",
            search: "",
            hash: "",
            state: { foo: "foo!", bar: "bar!" },
          },
        },
        route: {
          key: userKey,
          params: { user_id: "200" },
        },
        users: [{ user_id: 0 }, { user_id: 1 }, { user_id: 2 }, { user_id: 3 }],
        user: { user_id: 100 },
        posts: {},
        post: {},
      },
    },
    {
      name: "got user 200",
      action: user({ user_id: 200 }),
      want: {
        history: {
          action: "REPLACE",
          index: 2,
          length: 3,
          location: {
            pathname: "/users/200",
            search: "",
            hash: "",
            state: { foo: "foo!", bar: "bar!" },
          },
        },
        route: {
          key: userKey,
          params: { user_id: "200" },
        },
        users: [{ user_id: 0 }, { user_id: 1 }, { user_id: 2 }, { user_id: 3 }],
        user: { user_id: 200 },
        posts: {},
        post: {},
      },
    },
    {
      name: "replace to /users",
      action: replace("/users"),
      want: {
        history: {
          action: "REPLACE",
          index: 2,
          length: 3,
          location: {
            pathname: "/users",
            search: "",
            hash: "",
            state: { foo: "foo!", bar: "bar!" },
          },
        },
        route: {
          key: usersKey,
          params: {},
        },
        users: [{ user_id: 0 }, { user_id: 1 }, { user_id: 2 }, { user_id: 3 }],
        user: { user_id: 200 },
        posts: {},
        post: {},
      },
    },
    {
      name: "got users",
      action: users([
        { user_id: 4 },
        { user_id: 5 },
        { user_id: 6 },
        { user_id: 7 },
      ]),
      want: {
        history: {
          action: "REPLACE",
          index: 2,
          length: 3,
          location: {
            pathname: "/users",
            search: "",
            hash: "",
            state: { foo: "foo!", bar: "bar!" },
          },
        },
        route: {
          key: usersKey,
          params: {},
        },
        users: [{ user_id: 4 }, { user_id: 5 }, { user_id: 6 }, { user_id: 7 }],
        user: { user_id: 200 },
        posts: {},
        post: {},
      },
    },
    {
      name: "replace to /users/300",
      action: replace("/users/300"),
      want: {
        history: {
          action: "REPLACE",
          index: 2,
          length: 3,
          location: {
            pathname: "/users/300",
            search: "",
            hash: "",
            state: { foo: "foo!", bar: "bar!" },
          },
        },
        route: {
          key: userKey,
          params: { user_id: "300" },
        },
        users: [{ user_id: 4 }, { user_id: 5 }, { user_id: 6 }, { user_id: 7 }],
        user: { user_id: 200 },
        posts: {},
        post: {},
      },
    },
    {
      name: "got user 300",
      action: user({ user_id: 300 }),
      want: {
        history: {
          action: "REPLACE",
          index: 2,
          length: 3,
          location: {
            pathname: "/users/300",
            search: "",
            hash: "",
            state: { foo: "foo!", bar: "bar!" },
          },
        },
        route: {
          key: userKey,
          params: { user_id: "300" },
        },
        users: [{ user_id: 4 }, { user_id: 5 }, { user_id: 6 }, { user_id: 7 }],
        user: { user_id: 300 },
        posts: {},
        post: {},
      },
    },
  ] as Array<{
    name: string;
    action: Action;
    want: Store;
  }>).forEach(c => {
    it(c.name, () => {
      dispatch(c.action);
      const got = getState();
      c.want.history.location.key = got.history.location.key;
      expect(got).toEqual(c.want);
    });
  });
});
