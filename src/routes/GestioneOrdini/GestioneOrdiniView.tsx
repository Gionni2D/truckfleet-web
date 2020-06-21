import { i18n } from '../../i18n'
import { RouteList } from '..'
import * as React from 'react'
import app from '../../app'
import { Ordine } from "../../domain"

interface ViewProps {
	ordini : Ordine[]
	onChangeRoute(route: FromGestioneOrdiniRoute): void
}

export type FromGestioneOrdiniRoute =
  RouteList.InserisciOrdine |
  RouteList.Home

export default class GestioneOrdiniView
  extends React.Component<ViewProps> {

  readonly bundle: i18n

  constructor(props: ViewProps) {
    super(props)
    this.bundle = app.getBundle()
  }

  onChangeRoute(route: FromGestioneOrdiniRoute) {
    this.props.onChangeRoute(route)
  }

  render() {
    const b = this.bundle.routes.gestioneOrdini

	//starebbe bene anche degli spazi tra i due bottoni piuttosto che andare a capo
    return <div><h1>GestioneOrdini</h1>
		<button onClick={this.onChangeRoute.bind(this, RouteList.Home)}>Home</button><br/><br/>
		<button onClick={this.onChangeRoute.bind(this, RouteList.InserisciOrdine)}>{b.insertOrder}</button>
		<table>
			<thead>
				<tr>
					<th>#</th>
					<th>{b.ordersProperty.desc}</th>
					<th>{b.ordersProperty.from}</th>
					<th>{b.ordersProperty.to}</th>
					<th>{b.ordersProperty.load}</th>
					<th>{b.ordersProperty.unload}</th>
					<th>{b.ordersProperty.dimension}</th>
					<th>{b.ordersProperty.mass}</th>
				</tr>
			</thead>
			<tbody>
				{ this.props.ordini.map((ordine) => {
					console.log(ordine)
					return (<tr key={ordine.id}>
						<th>{ordine.id}</th>
						<td>{ordine.descrizione}</td>
						<td>{ordine.nomeMittente}</td>
						<td>{ordine.nomeDestinatario}</td>
						<td>{ordine.getInfoCarico()[0].indirizzo}</td>
						<td>{ordine.getInfoScarico()[0].indirizzo}</td>
						<td>{ordine.dimX}x{ordine.dimY}x{ordine.dimZ}cm</td>
						<td>{ordine.massa}kg</td>
					</tr>)
				})}
			</tbody>
		</table>
	</div>
  }
}