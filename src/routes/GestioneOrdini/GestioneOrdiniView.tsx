import { i18n } from '../../i18n'
import { RouteList } from '..'
import * as React from 'react'
import app from '../../app'
import { Ordine } from "../../domain"

interface ViewProps {
	ordini : Ordine[]
	onChangeRoute(route: FromGestioneOrdiniRoute): void
	onChangeFilterText(filterText: string): void
	filterText: string
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

  onChangeFilterText = (e: React.ChangeEvent<HTMLInputElement>) => {
	this.props.onChangeFilterText(e.target.value);
  }

  render() {
    const b = this.bundle.routes.gestioneOrdini

	//starebbe bene anche degli spazi tra i due bottoni piuttosto che andare a capo
	return <div><h1>{b.manageOrders}</h1>
		<button onClick={this.onChangeRoute.bind(this, RouteList.Home)}>Home</button><br/><br/>
		<input type="text" onChange={this.onChangeFilterText} value={this.props.filterText} placeholder={`${b.search}...`}></input>
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