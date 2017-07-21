# redux-hist

## Actions

- `push(path: history.Path, state?: history.LocationState): ReduxActions.Action<{path: history.Path, state?: history.LocationState}>`
- `replace(path: history.Path, state?: history.LocationState): ReduxActions.Action<{path: history.Path, state?: history.LocationState}>`
- `go(diff: number): ReduxActions.Action<number>`
- `back(): ReduxActions.Action<void>`
- `forward(): ReduxActions.Action<void>`

## Middlewares

- `createRouterMiddleware(router: Router, history: history.History): Redux.Middleware`
- `createStaticRouterMiddleware(router: Router, pathname: string): Redux.Middleware`

## Props

## Reducers

- `reduceHistory(state: History, action: HistoryAction): History`
- `reduceRouting(state: Routing, action: HistoryAction): Routing`

## Router

- `class Router`
  - `constructor()`
  - `router(path: pathToRegexp.Path): Key`
  - `exec(location: Pathname): Result`
