import { i18n } from '../../i18n'
import * as React from 'react'
import app from '../../app'
import Drawer from '../../components/Drawer'
import App from '../../components/App'
import { Spedizione, StatoSpedizione } from '../../domain'
import { formatDate } from '../../utils'
import { Grid, Typography, IconButton, Avatar, Fab, TextField } from '@material-ui/core'
import { Card, CardContent, CardHeader } from '@material-ui/core'
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

interface ViewProps {
	spedizioni: Spedizione[]
	onChangeFilterText(filterText: string): void
	onEliminaSpedizione(idSpedizione: number): boolean
	onVisualizzaSpedizione(id_spedizione: number): void
	onInserisciSpedizione(): void
	filterText: string
}

const style : { [key: string] : React.CSSProperties } = {
	fab: {
		position: 'fixed',
		bottom: "20px",
		right: "20px",
		zIndex: 3
	},
	card: {
		padding: 10,
		margin: "20px 0",
		cursor: "pointer"
	},
	mTitleContent: {
		marginTop: 20
	},
	mtText: {
		marginTop: 10
	}
}

export default class GestioneSpedizioniView
	extends React.Component<ViewProps> {

	readonly bundle: i18n

	constructor(props: ViewProps) {
		super(props)
		this.bundle = app.getBundle()
	}

	onEliminaSpedizione = (idSpedizione: number, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();
		if(confirm("Sei sicuro di voler cancellare la spedizione?")) {
			if(this.props.onEliminaSpedizione(idSpedizione))
				alert("Spedizione eliminata correttamente");
			else
				alert("Errore durante l'eliminazione della spedizione");
		}
	}

	onChangeFilterText = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onChangeFilterText(e.target.value);
	}

	render() {
		const b = this.bundle.routes.gestioneSpedizioni
		const bs = this.bundle.domain.shipmentProperties

		return <App>
			<Drawer>
				<Typography variant="h3" >{this.bundle.components.drawer.shipmentManagement}</Typography>

				<div style={style.mTitleContent}>
					<TextField
						label={`${b.search}...`}
						value={this.props.filterText}
						onChange={this.onChangeFilterText} />

					<Fab
						color="primary"
						style={style.fab}
						onClick={this.props.onInserisciSpedizione.bind(this)}>
						<AddIcon />
					</Fab>


					{ this.props.spedizioni.map((spedizione) =>
						<Card
							key={spedizione.id}
							style={style.card}
							onClick={this.props.onVisualizzaSpedizione.bind(this, spedizione.id)}>
							<CardHeader
								avatar={<Avatar><LocalShippingIcon /></Avatar>}
								title={<span>{spedizione.getTappe()[0].getMagazzino().indirizzo} <ArrowForwardIcon style={{fontSize: "inherit"}}/> {spedizione.getTappe()[spedizione.getTappe().length-1].getMagazzino().indirizzo}</span>}
								subheader={<span>
									{bs.id}: <b>{spedizione.id}</b><br/>
									{bs.state}: <b>{this.bundle.domain.shipmentState[spedizione.stato]}</b>
								</span>}
								action={ spedizione.stato == StatoSpedizione.CREATA ?
									<IconButton
										onClick={this.onEliminaSpedizione.bind(this, spedizione.id)}>
										<DeleteIcon />
									</IconButton>:
									undefined
								}
								/>
							<CardContent>
								<Grid container spacing={2}>
									<Grid item xs={4}>
										<div>
											<Typography variant="overline" color="textSecondary">{bs.departureDate}:</Typography>
											<Typography variant="body2">{formatDate(spedizione.getTappe()[0].arrivoPrevisto)}</Typography>
										</div>
										<div style={style.mt}>
											<Typography variant="overline" color="textSecondary">{bs.arrivalDate}:</Typography>
											<Typography variant="body2">{formatDate(spedizione.getTappe()[spedizione.getTappe().length-1].arrivoPrevisto)}</Typography>
										</div>
									</Grid>
									<Grid item xs={4}>
										<div>
											<Typography variant="overline" color="textSecondary">{bs.duration}:</Typography>
											<Typography variant="body2">{Math.round((spedizione.getTappe()[spedizione.getTappe().length-1].arrivoPrevisto-spedizione.getTappe()[0].arrivoPrevisto)/3600/1000)} h</Typography>
										</div>
										<div style={style.mt}>
											<Typography variant="overline" color="textSecondary">{bs.drivers}:</Typography>
											<Typography variant="body2">{spedizione.camionisti.map((camionista) => {if (camionista !== undefined) return <span style={{display: "block"}} key={camionista.userName}>{`${camionista.cognome} ${camionista.nome}`}</span>})}</Typography>
										</div>
									</Grid>
									<Grid item xs={4}>
										<div>
											<Typography variant="overline" color="textSecondary">{bs.numOrders}:</Typography>
											<Typography variant="body2">{spedizione.getOrdini().length}</Typography>
										</div>
										<div style={style.mt}>
											<Typography variant="overline" color="textSecondary">{bs.vehicle}:</Typography>
											<Typography variant="body2">{spedizione.veicoloModello} - {spedizione.veicoloTarga}</Typography>
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
