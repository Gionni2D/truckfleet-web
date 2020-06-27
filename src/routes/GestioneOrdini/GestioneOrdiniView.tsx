import { i18n } from '../../i18n'
import { RouteList } from '..'
import * as React from 'react'
import app from '../../app'
import { Ordine } from "../../domain"
import Drawer from '../../components/Drawer'
import App from '../../components/App'
import { Typography, Fab, TextField } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import OrderItem from '../../components/OrderItem'

interface ViewProps {
	ordini : Ordine[]
	onChangeRoute(route: FromGestioneOrdiniRoute): void
	onChangeFilterText(filterText: string): void
	onEliminaOrdine(idOrdine: number): boolean
	filterText: string
}

const style : { [key: string] : React.CSSProperties } = {
	fab: {
		position: 'fixed',
		bottom: "20px",
		right: "20px"
	},
	mTitleContent: {
		marginTop: 20
	}
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

	onEliminaOrdine = (idOrdine: number) => {
		if(this.props.onEliminaOrdine(idOrdine))
			alert("Ordine eliminato correttamente");
		else
			alert("Errore nell'eliminazione dell'ordine");
	}

	render() {
		const b  = this.bundle.routes.gestioneOrdini

		return <App>
			<Drawer >
				<Typography variant="h3" >{b.manageOrders}</Typography>

				<div style={style.mTitleContent}>
					<TextField
						label={`${b.search}...`}
						value={this.props.filterText}
						onChange={this.onChangeFilterText} />

					<Fab
						color="primary"
						style={style.fab}
						onClick={this.onChangeRoute.bind(this, RouteList.InserisciOrdine)}>
						<AddIcon />
					</Fab>

					{this.props.ordini.map((ordine) => (
						<OrderItem
							key={ordine.id}
							ordine={ordine}
							onEliminaOrdine={this.onEliminaOrdine}/>)
					)}
				</div>
			</Drawer>
		</App>
	}
}