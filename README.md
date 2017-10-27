# redux-hist [ ![Codeship Status for minodisk/redux-hist](https://app.codeship.com/projects/23e9f670-5087-0135-ac0e-1e8ed79b5a90/status?branch=master)](https://app.codeship.com/projects/234381) [![codecov](https://codecov.io/gh/minodisk/redux-hist/branch/master/graph/badge.svg)](https://codecov.io/gh/minodisk/redux-hist)

Middlewares / Actions / Reducers for Redux around History API.

## Usage

## API Reference

### Creating Action

#### `push(path: history.Path, userState?: any): PushAction`

**params:**

- `path: history.Path`: The URL path or location-like object that will be pushed to history stack.
- `userState?: any`: The state that will be saved as the location state.

**return:**

- `PushAction`:
  - `type: 'HISTORY_PUSH'`
  - `path: history.Path`
  - `userState?: any`

#### `replace(path: history.Path, state?: history.LocationState): {path: history.Path, state?: history.LocationState}`
#### `go(diff: number): ReduxActions.Action<number>`
#### `goBack(): ReduxActions.Action<void>`
#### `goForward(): ReduxActions.Action<void>`

### Dispatched Actions

#### `LOCATION_CHANGED`

Emitted when history is changed.

#### `RESTORE`

Requesting restoring store to Redux store.

### Middlewares

#### `createHistoryMiddleware(router: Router, history: history.History, option?: Option): redux.Middleware`

Create middleware using in browser.

**params:**

- `router: Router`: `Router` object created with **redux-hist** module.
- `history: History`: `History` object created with `history` module.
- `options?: Object`: Options for this middleware.
  - `saveStore: Object`: Saving Redux store object to current Location.
    - `onBeforeSavingStore?: <S>(store: S) => S`: A callback called before saving store. In callback, shrink text fields and return it. **redux-hist** saves returned store.
    - `onRequestShrinkStore: <S>(store: S) => S`: A callback called while saving store. In callback, shrink the list in store or delete field and return it. **redux-hist** retries saving returned store.

**return:**

- `redux.Middleware`: History middleware.

#### `createStaticRouterMiddleware(router: Router, pathname: string): redux.Middleware`

Create middleware using in server side rendering.

**params:**

- `router: Router`: `Router` object created with **redux-hist** module.
- `pathname: string`:

**return:**

- `redux.Middleware`: History middleware.

### Reducers

#### `reduceHistory(state: History, action: HistoryAction): History`
#### `reduceRouting(state: Routing, action: HistoryAction): Routing`

### Router

#### `class Router`
##### `constructor()`
##### `router(path: pathToRegexp.Path): Key`
##### `exec(location: Pathname): Result`

## Related package

- [redux-hist-react](https://github.com/minodisk/redux-hist-react)
