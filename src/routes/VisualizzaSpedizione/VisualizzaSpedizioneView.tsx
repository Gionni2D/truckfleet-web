import { i18n } from '../../i18n'
import * as React from 'react'
import app from '../../app'
import Drawer from '../../components/Drawer'
import App from '../../components/App'
import { Spedizione } from '../../domain'
import { formatDate } from '../../utils'

interface ViewProps {
	spedizione: Spedizione
}

export default class VisualizzaSpedizioneView
	extends React.Component<ViewProps> {

	readonly bundle: i18n

	constructor(props: ViewProps) {
		super(props)
		this.bundle = app.getBundle()
	}

	render() {
		const b = this.bundle.routes.visualizzaSpedizione
		const bo = this.bundle.routes.gestioneOrdini.ordersProperty
		const bs = this.bundle.routes.gestioneSpedizioni.shipmentProperty

		return <App>
		<Drawer>
			<h1>{this.bundle.components.drawer.shipmentDetails} #{this.props.spedizione.id}</h1>
			<div>
				<div>{b.map}</div>
				<div>
					<table>
						<caption>{b.stops}</caption>
						{ this.props.spedizione.getTappe().map((tappa) => {
							return (<tr key={tappa.id}>
								<td>{tappa.getMagazzino().indirizzo}</td>
								<td>{formatDate(tappa.arrivoPrevisto)}</td>
								<td>{tappa.arrivoEffettivo !== undefined && formatDate(tappa.arrivoEffettivo)}</td>
							</tr>)
						})}
					</table>
				</div>
			</div>
			<div>
			<table>
				<caption>{b.associatedOrders}</caption>
			<thead>
				<tr>
					<th>#</th>
					<th>{bo.desc}</th>
					<th>{bo.from}</th>
					<th>{bo.to}</th>
					<th>{bo.load}</th>
					<th>{bo.unload}</th>
					<th>{bo.dimension}</th>
					<th>{bo.mass}</th>
					<th>{bo.state}</th>
				</tr>
			</thead>
			<tbody>
				{ this.props.spedizione.getOrdini().map((ordine) => {
					return (<tr key={ordine.id}>
						<th>{ordine.id}</th>
						<td>{ordine.descrizione}</td>
						<td>{ordine.nomeMittente}</td>
						<td>{ordine.nomeDestinatario}</td>
						<td>{ordine.getInfoCarico()[0].indirizzo}</td>
						<td>{ordine.getInfoScarico()[0].indirizzo}</td>
						<td>{ordine.dimX}x{ordine.dimY}x{ordine.dimZ}cm</td>
						<td>{ordine.massa}kg</td>
						<td>{this.bundle.domain.orderState[ordine.stato]}</td>
					</tr>)
				})}
			</tbody>
		</table>
			</div>
			<div>
				<span>{bs.drivers}:</span> {this.props.spedizione.camionisti.map((camionista) => {if (camionista !== undefined) return <span key={camionista.userName}>{`${camionista.cognome} ${camionista.nome}`} </span>})}<br/>
				<span>{bs.vehicle}: </span> {this.props.spedizione.veicoloModello} - {this.props.spedizione.veicoloTarga} - {bs.unladenMass}: {this.props.spedizione.veicoloMassa} kg<br/>
				<span>{bs.trailer}: </span> {this.props.spedizione.rimorchioDimX}x{this.props.spedizione.rimorchioDimY}x{this.props.spedizione.rimorchioDimZ} cm -
				{bs.unladenMass}: {this.props.spedizione.rimorchioMassa} kg - {bs.maxLoad}: {this.props.spedizione.rimorchioCaricoMax} kg<br/>
				<span>{bs.state}: </span>{this.bundle.domain.shipmentState[this.props.spedizione.stato]}<br/>
			</div>
			</Drawer>
			</App>
	}
}