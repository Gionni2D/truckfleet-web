import InserisciOrdineView, {FromInserisciOrdineRoute} from './InserisciOrdineView'
import * as React from 'react'
import app from '../../app'
import { OrdineRaw, StatoOrdine, Magazzino } from '../../domain'

interface PresenterState {
	ordine: OrdineRaw,
	magazzinoCarico: Magazzino,
	magazzinoScarico: Magazzino
}

export default class VisualizzaSpedizionePresenter
	extends React.Component<{}, PresenterState> {

	constructor(props: {}) {
		super(props)
		this.initState()
	}

	initState = () => {
		this.state = {
			ordine: {
				descrizione: "",
				nomeMittente: "",
				nomeDestinatario: "",
				dimX: 1,
				dimY: 1,
				dimZ: 1,
				massa: 1
			},
			magazzinoCarico: {
				id: -1,
				indirizzo: ""
			},
			magazzinoScarico: {
				id: -1,
				indirizzo: ""
			}
		}
	}

	onChangeRoute = (route: FromInserisciOrdineRoute) => {
		app.changeRoute({ route })
	}

	onChangeValue = (value: string, attributeName: keyof OrdineRaw) => {
		let newOrdine: OrdineRaw = {...this.state.ordine, [attributeName]: value};
		this.setState({
			ordine: newOrdine
		});
	}

	onChangeMagazzinoCarico = (value: string) => {
		this.setState({
			magazzinoCarico: {...this.state.magazzinoCarico, indirizzo: value}
		});
	}

	onChangeMagazzinoScarico = (value: string) => {
		this.setState({
			magazzinoScarico: {...this.state.magazzinoScarico, indirizzo: value}
		});
	}

	onSubmit = (): boolean => {
		if(app.validaOrdine(this.state.ordine, this.state.magazzinoCarico, this.state.magazzinoScarico)) {//TODO: anche valida ordine dovrebbe avere i magazzini? magari per controllare che gli indirizzi non siano identici
			if(app.inserisciOrdine(this.state.ordine, this.state.magazzinoCarico, this.state.magazzinoScarico)) {
				//resetta ordine e magazzini allo stato iniziale
				this.initState()
				return true
			}
		}
		return false;
	}

	render() {
		return <InserisciOrdineView
			ordine={this.state.ordine}
			magazzinoCarico={this.state.magazzinoCarico}
			magazzinoScarico={this.state.magazzinoScarico}
			onChangeValue={this.onChangeValue}
			onChangeMagazzinoCarico={this.onChangeMagazzinoCarico}
			onChangeMagazzinoScarico={this.onChangeMagazzinoScarico}
			onSubmit={this.onSubmit}
			onChangeRoute={this.onChangeRoute}/>
	}
}