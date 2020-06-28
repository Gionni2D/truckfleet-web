import { RouteData } from "./routes";

export enum ActionType {
	CHANGE_ROUTE_ACTION,
	MAP_LOADED_ACTION
}

export type Action =
	ChangeRouteAction |
	MapLoadedAction

interface ChangeRouteAction {
	routeData: RouteData
	type: ActionType.CHANGE_ROUTE_ACTION
}

interface MapLoadedAction {
	type: ActionType.MAP_LOADED_ACTION
}