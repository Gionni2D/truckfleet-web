import { createStore, Store, Unsubscribe } from 'redux'
import { Action, ActionType as AT } from './actions'
import reducer, { State } from './reducer'
// import * as api from './api'
import { RouteData } from './routes'
import language, { i18n } from './i18n'
// import { Catalog } from './domain'

class App {
  private bundle: i18n
  private store: Store<State, Action>

  constructor() {
    this.store = createStore(reducer)
    this.bundle = language
  }

  setBundle = (bundle: i18n) => this.bundle = bundle

  getBundle = () => this.bundle

  getState = () => this.store.getState()

  subscribe = (listener: () => void) => this.store.subscribe(listener)

  changeRoute = (routeData: RouteData) => {
    this.store.dispatch({ type: AT.CHANGE_ROUTE_ACTION, routeData })
  }
}

const app = new App()

export default app