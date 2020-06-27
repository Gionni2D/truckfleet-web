import { i18n } from '../../i18n'
import * as React from 'react'
import app from '../../app'
import Drawer from '../../components/Drawer'
import App from '../../components/App'
import { Spedizione } from '../../domain'
import { formatDate } from '../../utils'
import OrderItem from '../../components/OrderItem'
import { Grid, Typography, IconButton, Avatar, Fab, TextField } from '@material-ui/core'
import { Card, CardContent, CardHeader } from '@material-ui/core'

interface ViewProps {
	spedizione: Spedizione
}


const style : { [key: string] : React.CSSProperties } = {
	card: {
		padding: 10,
		margin: "20px 0"
	},
	mt: {
		marginTop: 10
	}
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
		const bo = this.bundle.domain.orderProperties
		const bs = this.bundle.domain.shipmentProperties

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
			<Card style={style.card}>
				<CardContent>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={4}>
							<div>
								<Typography variant="overline" color="textSecondary">{bs.drivers}:</Typography>
								<Typography variant="body2">{this.props.spedizione.camionisti.map((camionista) => {if (camionista !== undefined) return <span key={camionista.userName} style={{display: "block"}}>{`${camionista.cognome} ${camionista.nome}`} </span>})}</Typography>
							</div>
							<div style={style.mt}>
								<Typography variant="overline" color="textSecondary">{bs.state}:</Typography>
								<Typography variant="body2">{this.bundle.domain.shipmentState[this.props.spedizione.stato]}</Typography>
							</div>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<div>
								<Typography variant="overline" color="textSecondary">{bs.vehicle}:</Typography>
								<Typography variant="body2">{this.props.spedizione.veicoloModello} - {this.props.spedizione.veicoloTarga}</Typography>
							</div>
							<div style={style.mt}>
								<Typography variant="overline" color="textSecondary">{bs.unladenMass}:</Typography>
								<Typography variant="body2">{this.props.spedizione.veicoloMassa} kg</Typography>
							</div>
						</Grid>
						<Grid item xs={12} sm={6} md={4}>
							<div>
								<Typography variant="overline" color="textSecondary">{bs.trailer}:</Typography>
								<Typography variant="body2">{this.props.spedizione.rimorchioDimX}x{this.props.spedizione.rimorchioDimY}x{this.props.spedizione.rimorchioDimZ} cm</Typography>
							</div>
							<div style={style.mt}>
								<Typography variant="overline" color="textSecondary">{bs.trailer}:</Typography>
								<Typography variant="body2">{bs.unladenMass}: {this.props.spedizione.rimorchioMassa} kg<br/>
									{bs.maxLoad}: {this.props.spedizione.rimorchioCaricoMax} kg
								</Typography>
							</div>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
			<div>
				{ this.props.spedizione.getOrdini().map((ordine) => <OrderItem ordine={ordine}/> )}
			</div>
			</Drawer>
			</App>
	}
}