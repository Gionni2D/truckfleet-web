import { i18n } from '../../i18n'
import { RouteList } from '..'
import * as React from 'react'
import app from '../../app'

interface ViewProps {
	onChangeRoute(route: FromHomeRoute) : void
}

export type FromHomeRoute =
	RouteList.GestioneOrdini |
	RouteList.GestioneSpedizioni

export default class HomeView
	extends React.Component<ViewProps> {

	readonly bundle: i18n

	constructor(props: ViewProps) {
		super(props)
		this.bundle = app.getBundle()
	}

	onChangeRoute(route: FromHomeRoute) {
		this.props.onChangeRoute(route)
	}

	render() {
		const b = this.bundle.routes.home

		return <div>
			<h1>{b.title}</h1>
			<br/><br/>
			<button onClick={this.onChangeRoute.bind(this, RouteList.GestioneOrdini)}>GestioneOrdini</button>
			<br/><br/>
			<button onClick={this.onChangeRoute.bind(this, RouteList.GestioneSpedizioni)}>GestioneSpedizioni</button>
		</div>
	}
}