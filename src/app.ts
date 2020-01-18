import { createStore, Store, Unsubscribe } from 'redux'
import { Action, ActionType as AT } from './actions'
import reducer, { State } from './reducer'
import * as api from './api'
import { RouteList } from './routes'
import { Catalog } from './domain'

class App {
  private bundle: any
  private store: Store<State, Action>

  constructor() {
    this.store = createStore(reducer)
  }

  setBundle = (bundle: any) => this.bundle = bundle

  getBundle = () => this.bundle

  getState = () => this.store.getState()

  subscribe = (listener: () => void) => this.store.subscribe(listener)

  changeRoute = (to: RouteList, data?: any) => {
    this.store.dispatch({ type: AT.CHANGE_ROUTE_ACTION, to, data })
  }
}

const app = new App()

export default app