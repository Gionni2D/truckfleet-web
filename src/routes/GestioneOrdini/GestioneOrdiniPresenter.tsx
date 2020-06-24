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

	onChangeFilterText = (filterText: string) => {//la notazione in questo modo conserva this allo scope padre: https://stackoverflow.com/a/59404368
		this.setState({
			ordini: app.getOrdini((o: Ordine) => {
				return o.descrizione.toLowerCase().includes(filterText.toLowerCase()) ||
					o.nomeMittente.toLowerCase().includes(filterText.toLowerCase()) ||
					o.nomeDestinatario.toLowerCase().includes(filterText.toLowerCase()) ||
					o.getInfoCarico()[0].indirizzo.toLowerCase().includes(filterText.toLowerCase()) ||
					o.getInfoScarico()[0].indirizzo.toLowerCase().includes(filterText.toLowerCase())
			}),
			filterText: filterText
		})
	}

	onEliminaOrdine = (idOrdine: number): boolean => {
		if(app.rimuoviOrdine(app.getOrdini((o: Ordine) => o.id == idOrdine)[0])) {
			//aggiorna state con elenco ordini, preservando eventuali filtri messi
			this.onChangeFilterText(this.state.filterText);
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