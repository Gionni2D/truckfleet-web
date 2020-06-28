import { RouteData } from "./routes";
import { Action, ActionType } from "./actions";

export interface State {
	routeData: RouteData,
	mapLoaded: boolean
}

const defaultState : State = {
	routeData: { route: 0 },
	mapLoaded: false
}

export default (state: State = defaultState, action: Action) => {
	switch(action.type) {
		case ActionType.CHANGE_ROUTE_ACTION:
			return { ...state, routeData: action.routeData }
		case ActionType.MAP_LOADED_ACTION:
			return { ...state, mapLoaded: true}
	}
	return state
}