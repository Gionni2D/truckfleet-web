import GestioneSpedizioniView from './GestioneSpedizioniView'
import * as React from 'react'
import app from '../../app'
import { Spedizione } from '../../domain'
import { RouteList } from '..'
import { formatDate } from '../../utils'
import { i18n } from '../../i18n'

interface PresenterState {
	spedizioni: Spedizione[]
	filterText: string
}

export default class GestioneSpedizioniPresenter
	extends React.Component<{}, PresenterState> {

	readonly bundle: i18n

	constructor(props: {}) {
		super(props)
		this.state = {
			spedizioni: [],
			filterText: ""
		}
		this.bundle = app.getBundle()
	}

	componentDidMount() {
		this.setState({
			spedizioni: app.getSpedizioni()
		})
	}

	onVisualizzaSpedizione = (id_spedizione: number) => {
		app.changeRoute({ route: RouteList.VisualizzaSpedizione, id_spedizione })
	}

	onInserisciSpedizione = () => {
		app.changeRoute({ route: RouteList.InserisciSpedizione })
	}

	updateState = (filterText = this.state.filterText) => {
		this.setState({
			spedizioni: app.getSpedizioni((s: Spedizione) => {
				const fl = filterText.toLowerCase();
				return s.camionisti.some(c => { if (c !== undefined) return (c.cognome + " " + c.nome).toLowerCase().includes(fl) }) ||
					this.bundle.domain.shipmentState[s.stato].toLowerCase().includes(fl) ||
					formatDate(s.getTappe()[0].arrivoPrevisto).includes(fl) ||
					formatDate(s.getTappe()[s.getTappe().length-1].arrivoPrevisto).includes(fl) ||
					s.veicoloModello.toLocaleLowerCase().includes(fl) ||
					s.veicoloTarga.toLowerCase().includes(fl)
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
			onInserisciSpedizione={this.onInserisciSpedizione}
			spedizioni={this.state.spedizioni}/>
	}
}