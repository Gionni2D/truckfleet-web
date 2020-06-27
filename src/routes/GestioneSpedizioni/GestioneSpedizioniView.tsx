import { i18n } from '../../i18n'
import * as React from 'react'
import app from '../../app'
import Drawer from '../../components/Drawer'
import App from '../../components/App'
import { Spedizione, StatoSpedizione } from '../../domain'
import { formatDate } from '../../utils'

interface ViewProps {
	spedizioni: Spedizione[]
	onChangeFilterText(filterText: string): void
	onEliminaSpedizione(idSpedizione: number): boolean
	onVisualizzaSpedizione(id_spedizione: number): void
	filterText: string
}

export default class GestioneSpedizioniView
	extends React.Component<ViewProps> {

	readonly bundle: i18n

	constructor(props: ViewProps) {
		super(props)
		this.bundle = app.getBundle()
	}

	onEliminaSpedizione = (idSpedizione: number) => {
		if(this.props.onEliminaSpedizione(idSpedizione))
			alert("Spedizione eliminata correttamente");
		else
			alert("Errore durante l'eliminazione della spedizione");
	}

	onChangeFilterText = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onChangeFilterText(e.target.value);
	}

	render() {
		const b = this.bundle.routes.gestioneSpedizioni

		return <App>
			<Drawer>
				<h1>{this.bundle.components.drawer.shipmentManagement}</h1>
				<div>
				<input type="text" onChange={this.onChangeFilterText} value={this.props.filterText} placeholder={`${b.search}...`}></input>
				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>{b.shipmentProperty.departureDate}</th>
							<th>{b.shipmentProperty.arrivalDate}</th>
							<th>Distanza</th>
							<th>{b.shipmentProperty.drivers}</th>
							<th>{b.shipmentProperty.state}</th>
							<th>{b.actions}</th>
						</tr>
					</thead>
					<tbody>
						{ this.props.spedizioni.map((spedizione) => {
							return (<tr key={spedizione.id}>
								<th>{spedizione.id}</th>
								<td>{formatDate(spedizione.getTappe()[0].arrivoPrevisto)}</td>
								<td>{formatDate(spedizione.getTappe()[spedizione.getTappe().length-1].arrivoPrevisto)}</td>
								<td>{spedizione.getTappe()[0].arrivoPrevisto}</td>
								<td>{spedizione.camionisti.map((camionista) => {if (camionista !== undefined) return <span style={{display: "block"}} key={camionista.userName}>{`${camionista.cognome} ${camionista.nome}`}</span>})}</td>
								<td>{this.bundle.domain.shipmentState[spedizione.stato]}</td>
								<td>
									<button onClick={this.props.onVisualizzaSpedizione.bind(this, spedizione.id)}>{b.details}</button>
									{spedizione.stato === StatoSpedizione.CREATA && (<button onClick={() => this.onEliminaSpedizione(spedizione.id)}>{b.delete}</button>)}
								</td>
							</tr>)
						})}
					</tbody>
				</table>
				</div>
			</Drawer>
			</App>
	}
}