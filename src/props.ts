import {
  History,
  Routing,
} from "./actions";
import {
  Params,
} from "./router";

export interface HistoryProps {
  history: History;
}

export interface RoutingProps {
  routing: Routing;
}

export interface ParamsProps {
  params: Params;
}
