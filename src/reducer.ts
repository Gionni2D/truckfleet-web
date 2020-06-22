import { RouteData } from "./routes";
import { Action, ActionType } from "./actions";

export interface State {
	routeData: RouteData
}

const defaultState : State = {
	routeData: { route: 0 }
}

export default (state: State = defaultState, action: Action) => {
	switch(action.type) {
		case ActionType.CHANGE_ROUTE_ACTION:
			return { ...state, routeData: action.routeData }
	}
	return state
}