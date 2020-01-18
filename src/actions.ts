import { RouteList } from "./routes";

export enum ActionType {
  CHANGE_ROUTE_ACTION
}

export type Action =
  ChangeRouteAction

interface ChangeRouteAction {
  to: RouteList
  data: any
  type: ActionType.CHANGE_ROUTE_ACTION
}
