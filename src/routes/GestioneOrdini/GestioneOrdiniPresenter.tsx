import GestioneOrdiniView, {FromGestioneOrdiniRoute} from './GestioneOrdiniView'
import * as React from 'react'
import app from '../../app'
import { Ordine } from '../../domain'

interface PresenterState {
	ordini: Ordine[],
	filterText: string
}

export default class GestioneOrdiniPresenter
	extends React.Component<{}, PresenterState> {

	constructor(props: {}) {
		super(props)
		this.state = {
			ordini: [],
			filterText: ""
		}
	}

	componentDidMount() {
		this.setState({
			ordini: app.getOrdini()
		})
	}

	onChangeRoute = (route: FromGestioneOrdiniRoute) => {
		app.changeRoute({ route })
	}

	updateState = (filterText = this.state.filterText) => {
		this.setState({
			ordini: app.getOrdini((o: Ordine) => {
				const fl = filterText.toLowerCase();
				return o.descrizione.toLowerCase().includes(fl) ||
					o.nomeMittente.toLowerCase().includes(fl) ||
					o.nomeDestinatario.toLowerCase().includes(fl) ||
					o.getInfoCarico()[0].indirizzo.toLowerCase().includes(fl) ||
					o.getInfoScarico()[0].indirizzo.toLowerCase().includes(fl)
			}),
			filterText
		})
	}

	onChangeFilterText = (filterText: string) => {//la notazione in questo modo conserva this allo scope padre: https://stackoverflow.com/a/59404368
		this.updateState(filterText)
	}

	onEliminaOrdine = (idOrdine: number): boolean => {
		if(app.rimuoviOrdine(this.state.ordini.filter((o: Ordine) => o.id == idOrdine)[0])) {
			//aggiorna state con elenco ordini
			this.updateState();
			return true;
		}
		else
			return false;
	}

	render() {
		return <GestioneOrdiniView
			ordini={this.state.ordini}
			filterText={this.state.filterText}
			onChangeFilterText={this.onChangeFilterText}
			onEliminaOrdine={this.onEliminaOrdine}
			onChangeRoute={this.onChangeRoute}/>
	}
}