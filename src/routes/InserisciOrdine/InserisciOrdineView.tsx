import { i18n } from '../../i18n'
import { RouteList } from '..'
import * as React from 'react'
import app from '../../app'
import { OrdineRaw, MagazzinoRaw } from '../../domain'
import Drawer from '../../components/Drawer'
import App from '../../components/App'

interface ViewProps {
	onChangeRoute(route: FromInserisciOrdineRoute): void
	onChangeValue(value: string, attributeName: keyof OrdineRaw): void
	onChangeMagazzinoCarico(value: string): void
	onChangeMagazzinoScarico(value: string): void
	onSubmit(): boolean
	ordine: OrdineRaw
	magazzinoCarico: MagazzinoRaw
	magazzinoScarico: MagazzinoRaw
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

	onChangeValue = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
		if(!Object.keys(this.props.ordine).includes(e.target.name))
			throw new TypeError(`Object Ordine has not an attribute named '${e.target.name}'`);
		this.props.onChangeValue(e.target.value, e.target.name as keyof OrdineRaw);
	}

	onChangeMagazzinoCarico = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onChangeMagazzinoCarico(e.target.value);
	}

	onChangeMagazzinoScarico = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onChangeMagazzinoScarico(e.target.value);
	}

	onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		if(this.props.onSubmit())
			alert("Ordine inserito correttamente");
		else
			alert("Errore nell'inserimento dell'ordine");//TODO: dovrei dire se è un errore di validazione o un errore di inserimento, portandomi dietro non un bool ma qualcosa di più?
		e.preventDefault();
	}

	render() {
		const b = this.bundle.routes.inserisciOrdine
		const bg = this.bundle.routes.gestioneOrdini

		return <App>
			<Drawer>
				<h1>{bg.insertOrder}</h1><div>
			<button onClick={this.onChangeRoute.bind(this, RouteList.Home)}>Home</button><br/><br/>
			<button onClick={this.onChangeRoute.bind(this, RouteList.GestioneOrdini)}>{bg.manageOrders}</button><br/><br/>

			<form onSubmit={this.onSubmit}>
			<input type="text" placeholder={bg.ordersProperty.from} value={this.props.ordine.nomeMittente} onChange={this.onChangeValue} name="nomeMittente"></input>
			<input type="text" placeholder={bg.ordersProperty.load} value={this.props.magazzinoCarico.indirizzo} onChange={this.onChangeMagazzinoCarico}></input><br/><br/>
			<input type="text" placeholder={bg.ordersProperty.to} value={this.props.ordine.nomeDestinatario} onChange={this.onChangeValue} name="nomeDestinatario"></input>
			<input type="text" placeholder={bg.ordersProperty.unload} value={this.props.magazzinoScarico.indirizzo} onChange={this.onChangeMagazzinoScarico}></input><br/><br/>
			<textarea placeholder={bg.ordersProperty.desc} value={this.props.ordine.descrizione} onChange={this.onChangeValue} name="descrizione" maxLength={500}></textarea><br/><br/>
			Dimensioni pacco:
			<input type="number" placeholder="x" value={this.props.ordine.dimX} onChange={this.onChangeValue} name="dimX" min="1" max="5000"></input> cm
			<input type="number" placeholder="y" value={this.props.ordine.dimY} onChange={this.onChangeValue} name="dimY" min="1" max="5000"></input> cm
			<input type="number" placeholder="z" value={this.props.ordine.dimZ} onChange={this.onChangeValue} name="dimZ" min="1" max="5000"></input> cm
			<input type="number" placeholder={bg.ordersProperty.mass} value={this.props.ordine.massa} onChange={this.onChangeValue} name="massa" min="0" max="44000" step="0.001"></input> kg<br/><br/>
			<input type="submit" value={b.insert}></input>
			</form>
		</div>
		</Drawer>
		</App>
	}
}