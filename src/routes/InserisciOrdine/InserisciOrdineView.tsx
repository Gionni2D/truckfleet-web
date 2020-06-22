import { i18n } from '../../i18n'
import { RouteList } from '..'
import * as React from 'react'
import app from '../../app'

interface ViewProps {
	onChangeRoute(route: FromInserisciOrdineRoute): void
}

export type FromInserisciOrdineRoute =
  RouteList.GestioneOrdini |
  RouteList.Home

export default class InserisciOrdineView
  extends React.Component<ViewProps> {

  readonly bundle: i18n

  constructor(props: ViewProps) {
    super(props)
    this.bundle = app.getBundle()
  }

  onChangeRoute(route: FromInserisciOrdineRoute) {
    this.props.onChangeRoute(route)
  }

  render() {
	const b = this.bundle.routes.inserisciOrdine
	const bg = this.bundle.routes.gestioneOrdini

	return <div><h1>{bg.insertOrder}</h1>
		<button onClick={this.onChangeRoute.bind(this, RouteList.Home)}>Home</button><br/><br/>
		<button onClick={this.onChangeRoute.bind(this, RouteList.GestioneOrdini)}>{bg.manageOrders}</button>
		
	</div>
  }
}