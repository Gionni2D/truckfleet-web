import { i18n } from '../../i18n'
import { RouteList } from '..'
import * as React from 'react'
import app from '../../app'
import { Ordine, StatoOrdine } from "../../domain"
import Drawer from '../../components/Drawer'
import App from '../../components/App'
import { Grid, Typography, IconButton, Avatar, Fab, TextField } from '@material-ui/core'
import { Card, CardContent, CardHeader } from '@material-ui/core'
import OrderIcon from '@material-ui/icons/ListAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

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
	card: {
		padding: 10,
		margin: "20px 0"
	},
	mTitleContent: {
		marginTop: 20
	},
	mtText: {
		marginTop: 10
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
		const bd = this.bundle.domain

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

					{ this.props.ordini.map((ordine) =>
						<Card key={ordine.id} style={style.card}>
							<CardHeader
								avatar={<Avatar><OrderIcon /></Avatar>}
								title={ordine.descrizione}
								subheader={<span>
									{bd.orderProperties.id}: <b>{ordine.id}</b><br/>
									{bd.orderProperties.state}: <b>{bd.orderState[ordine.stato]}</b>
								</span>}
								action={ ordine.stato == StatoOrdine.INSERITO ?
									<IconButton
										onClick={this.onEliminaOrdine.bind(this, ordine.id)}>
										<DeleteIcon />
									</IconButton>:
									undefined
								}
								/>
							<CardContent>
								<Grid container spacing={2}>
									<Grid item xs={4}>
										<div>
											<Typography variant="overline" color="textSecondary">{bd.orderProperties.from}:</Typography>
											<Typography variant="body2">{ordine.nomeMittente}</Typography>
										</div>
										<div style={style.mt}>
											<Typography variant="overline" color="textSecondary">{bd.orderProperties.to}:</Typography>
											<Typography variant="body2">{ordine.nomeDestinatario}</Typography>
										</div>
									</Grid>
									<Grid item xs={4}>
										<div>
											<Typography variant="overline" color="textSecondary">{bd.orderProperties.load}:</Typography>
											<Typography variant="body2">{ordine.getInfoCarico()[0].indirizzo}</Typography>
										</div>
										<div style={style.mt}>
											<Typography variant="overline" color="textSecondary">{bd.orderProperties.unload}:</Typography>
											<Typography variant="body2">{ordine.getInfoScarico()[0].indirizzo}</Typography>
										</div>
									</Grid>
									<Grid item xs={4}>
										<div>
											<Typography variant="overline" color="textSecondary">{bd.orderProperties.dimension}:</Typography>
											<Typography variant="body2">{ordine.dimX}x{ordine.dimY}x{ordine.dimZ}cm</Typography>
										</div>
										<div style={style.mt}>
											<Typography variant="overline" color="textSecondary">{bd.orderProperties.mass}:</Typography>
											<Typography variant="body2">{ordine.massa}kg</Typography>
										</div>
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					)}
				</div>
			</Drawer>
		</App>
	}
}