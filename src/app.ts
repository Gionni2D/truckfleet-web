import { createStore, Store, Unsubscribe } from 'redux'
import { Action, ActionType as AT } from './actions'
import reducer, { State } from './reducer'
import language, { i18n } from './i18n'
import { RouteData } from './routes'
import { Model } from './domain'
import api from './api'

class App implements Model {
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

	getSpedizioni = api.getSpedizioni
	getMagazzini = api.getMagazzini
	getOrdini = api.getOrdini
	getTappe = api.getTappe
	inserisciSpedizione = api.inserisciSpedizione
	rimuoviSpedizione = api.rimuoviSpedizione
	validaSpedizione = api.validaSpedizione
	inserisciOrdine = api.inserisciOrdine
	rimuoviOrdine = api.rimuoviOrdine
	validaOrdine = api.validaOrdine
	getMe = api.getMe

}

const app = new App()

export default app