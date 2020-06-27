import GestioneSpedizioniView from './GestioneSpedizioniView'
import * as React from 'react'
import app from '../../app'
import { Spedizione } from '../../domain'
import { RouteList } from '..'

interface PresenterState {
	spedizioni: Spedizione[]
	filterText: string
}

export default class GestioneSpedizioniPresenter
	extends React.Component<{}, PresenterState> {

	constructor(props: {}) {
		super(props)
		this.state = {
			spedizioni: [],
			filterText: ""
		}
	}

	componentDidMount() {
		this.setState({
			spedizioni: app.getSpedizioni()
		})
	}

	onVisualizzaSpedizione = (id_spedizione: number) => {
		app.changeRoute({ route: RouteList.VisualizzaSpedizione, id_spedizione })
	}

	updateState = (filterText = this.state.filterText) => {
		this.setState({
			spedizioni: app.getSpedizioni((s: Spedizione) => {
				const fl = filterText.toLowerCase();
				return true
			}),
			filterText
		})
	}

	onChangeFilterText = (filterText: string) => {
		this.updateState(filterText)
	}

	onEliminaSpedizione = (idSpedizione: number): boolean => {
		if(app.rimuoviSpedizione(this.state.spedizioni.filter((s: Spedizione) => s.id == idSpedizione)[0])) {
			this.updateState();
			return true;
		}
		else
			return false;
	}

	render() {
		return <GestioneSpedizioniView
			filterText={this.state.filterText}
			onChangeFilterText={this.onChangeFilterText}
			onEliminaSpedizione={this.onEliminaSpedizione}
			onVisualizzaSpedizione={this.onVisualizzaSpedizione}
			spedizioni={this.state.spedizioni}/>
	}
}