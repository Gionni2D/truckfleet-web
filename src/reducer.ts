import { RouteList } from "./routes";
import { Action, ActionType } from "./actions";

export interface State {
  route: RouteList
  routeData: any
}

const defaultState : State = {
  route: 0,
  routeData: null
}

export default (state: State = defaultState, action: Action) => {
  switch(action.type) {
    case ActionType.CHANGE_ROUTE_ACTION:
      return { ...state, route: action.to, routeData: action.data }
  }
  return state
}