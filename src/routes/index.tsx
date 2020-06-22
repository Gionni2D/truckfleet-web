import * as React from 'react'
import HomePresenter from './Home/HomePresenter'
import GestioneOrdiniPresenter from './GestioneOrdini/GestioneOrdiniPresenter'
import InserisciOrdinePresenter from './InserisciOrdine/InserisciOrdinePresenter'
import GestioneSpedizioniPresenter from './GestioneSpedizioni/GestioneSpedizioniPresenter'
import InserisciSpedizionePresenter from './InserisciSpedizione/InserisciSpedizionePresenter'
import VisualizzaSpedizionePresenter, { VisualizzaSpedizionePresenterProps } from './VisualizzaSpedizione/VisualizzaSpedizionePresenter'
import app from '../app'

export enum RouteList {
	Default,
	Home,
	GestioneOrdini,
	GestioneSpedizioni,
	InserisciOrdine,
	InserisciSpedizione,
	VisualizzaSpedizione
}

type RoutesWithoutData =
	RouteList.Default |
	RouteList.Home |
	RouteList.GestioneOrdini |
	RouteList.GestioneSpedizioni |
	RouteList.InserisciOrdine |
	RouteList.InserisciSpedizione

interface BaseRouteData { route: RoutesWithoutData }

interface VisualizzaSpedizioneRouteData
	extends VisualizzaSpedizionePresenterProps {
	route: RouteList.VisualizzaSpedizione;
}

export type RouteData =
	BaseRouteData |
	VisualizzaSpedizioneRouteData

export default class Router
	extends React.Component<{}, { data: RouteData }> {

	constructor(props={}) {
		super(props);
		this.state = {
			data: {
				route: RouteList.Default
			}
		}
	}

	componentDidMount() {
		app.subscribe(this.onAppStateUpdate)
		app.changeRoute(this.state.data);
	}

	onAppStateUpdate = () => {
		const { routeData } = app.getState()
		this.setState({ data: routeData })
	}

	render() {
		const { data } = this.state
		switch(data.route) {
			case RouteList.Default:
			case RouteList.Home:
				return <HomePresenter />
			case RouteList.GestioneOrdini:
				return <GestioneOrdiniPresenter />
			case RouteList.GestioneSpedizioni:
				return <GestioneSpedizioniPresenter />
			case RouteList.InserisciOrdine:
				return <InserisciOrdinePresenter />
			case RouteList.InserisciSpedizione:
				return <InserisciSpedizionePresenter />
			case RouteList.VisualizzaSpedizione:
				return <VisualizzaSpedizionePresenter
					id_spedizione={data.id_spedizione}/>
			default:
				return <div>No case</div>
		}
	}
}