# redux-hist [ ![Codeship Status for minodisk/redux-hist](https://app.codeship.com/projects/23e9f670-5087-0135-ac0e-1e8ed79b5a90/status?branch=master)](https://app.codeship.com/projects/234381) [![codecov](https://codecov.io/gh/minodisk/redux-hist/branch/master/graph/badge.svg)](https://codecov.io/gh/minodisk/redux-hist)

## Actions

### `push(path: history.Path, state?: history.LocationState): ReduxActions.Action<{path: history.Path, state?: history.LocationState}>`
### `replace(path: history.Path, state?: history.LocationState): ReduxActions.Action<{path: history.Path, state?: history.LocationState}>`
### `go(diff: number): ReduxActions.Action<number>`
### `goBack(): ReduxActions.Action<void>`
### `goForward(): ReduxActions.Action<void>`

## Middlewares

### `createRouterMiddleware(router: Router, history: history.History): Redux.Middleware`
### `createStaticRouterMiddleware(router: Router, pathname: string): Redux.Middleware`

## Reducers

### `reduceHistory(state: History, action: HistoryAction): History`
### `reduceRouting(state: Routing, action: HistoryAction): Routing`

## Router

### `class Router`
#### `constructor()`
#### `router(path: pathToRegexp.Path): Key`
#### `exec(location: Pathname): Result`
