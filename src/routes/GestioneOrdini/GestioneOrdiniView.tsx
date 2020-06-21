import { i18n } from '../../i18n'
import { RouteList } from '..'
import * as React from 'react'
import app from '../../app'
import { Ordine } from "../../domain"

interface ViewProps {
	onChangeRoute(route: FromGestioneOrdiniRoute): void
}

export type FromGestioneOrdiniRoute =
  RouteList.InserisciOrdine

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

    return <div><h1>GestioneOrdini</h1>
		<button onClick={this.onChangeRoute.bind(this, RouteList.InserisciOrdine)}>{b.insertOrder}</button>
		<table>
			<thead>
				<tr>
					<th>#</th>
					<th>Descrizione</th>
					<th>Mittente</th>
					<th>Destinatario</th>
					<th>Carico</th>
					<th>Scarico</th>
					<th>Dimensioni</th>
					<th>Massa</th>
				</tr>
			</thead>
			<tbody>
				{app.getOrdini((o: Ordine) => {return true } ).map((ordine) => {
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