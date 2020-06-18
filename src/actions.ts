import { RouteData } from "./routes";

export enum ActionType {
  CHANGE_ROUTE_ACTION
}

export type Action =
  ChangeRouteAction

interface ChangeRouteAction {
  routeData: RouteData
  type: ActionType.CHANGE_ROUTE_ACTION
}
