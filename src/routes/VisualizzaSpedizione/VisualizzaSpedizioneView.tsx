import { i18n } from '../../i18n'
import * as React from 'react'
import app from '../../app'
import Drawer from '../../components/Drawer'
import App from '../../components/App'
import { Spedizione, StatoSpedizione, Posizione } from '../../domain'
import { formatDate } from '../../utils'
import OrderItem from '../../components/OrderItem'
import { Grid, Typography, IconButton, Avatar, Fab, TextField, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core'
import { Card, CardContent, CardHeader } from '@material-ui/core'
import { BorderRight, ClosedCaptionSharp } from '@material-ui/icons'
import StageList from '../../components/StageList'
import ShipmentInfo from '../../components/ShipmentInfo'

interface ViewProps {
	spedizione: Spedizione,
	mapLoaded: boolean,
	posizioni: Posizione[]
}


const style : { [key: string] : React.CSSProperties } = {
	card: {
		padding: 10,
		margin: "20px 0"
	},
	mt: {
		marginTop: 10
	},
	scrollBox: {
		width: '100%',
		height: '300px',
		flexWrap: 'unset',
		overflowY: 'scroll',
		overflowX: 'hidden'
	},
}

export default class VisualizzaSpedizioneView
	extends React.Component<ViewProps> {

	readonly bundle: i18n

	private map?: google.maps.Map
	private retry?: number
	//private directionsService?: google.maps.DirectionsService
	//private directionsRenderer?: google.maps.DirectionsRenderer

	constructor(props: ViewProps) {
		super(props)
		this.bundle = app.getBundle()
	}

	componentDidMount() {
		if(!this.props.mapLoaded) {
			this.retry = window.setTimeout(this.componentDidMount, 1000);
			return;
		}
		this.renderMap();
	}
	componentWillUnmount() {
		if(this.retry) clearTimeout(this.retry);
	}

	renderMap() {
		//Se la spedizione è già terminata le indicazioni stradali non vengono mostrate
		//Se la spedizione non è ancora partita, start=1a tappa, altrimenti se è in corso start=posizione camion
		//waypoints = tutte le tappe nelle quali il camionista ancora non si è fermato, tranne inizio e fine
		//nel caso in cui una tappa sia già stata visitata viene messo un marker manuale
		//tutte le cordinate GPS della spedizione in corso o conclusa vengono unite con una linea e mostrate
		let bologna = {lat: 44.49911, lng: 11.3316855};

		this.map = new google.maps.Map(document.getElementById("map") as Element, {zoom: 5, center: bologna});
		let directionsService = new google.maps.DirectionsService();
		let directionsRenderer = new google.maps.DirectionsRenderer();
		let geocoder = new google.maps.Geocoder();
		directionsRenderer.setMap(this.map);

		let tappe = this.props.spedizione.getTappe();

		let waypoints: google.maps.DirectionsWaypoint[] = [];

		//per tutte le tappe, tranne prima ed ultima, se è già stata visitata aggiunge un marker altrimenti le aggiunge al percorso da svolgere
		for(let i = 1; i < tappe.length - 1; i++) {
			if(tappe[i].arrivoEffettivo === undefined) {
				waypoints.push({location: tappe[i].getMagazzino().indirizzo});
			} else {
				this.addMarker(tappe[i].getMagazzino().indirizzo, ""+(i+1), geocoder);
			}
		}
		//se ci sono almeno 2 posizioni crea una linea che le unisce
		if(this.props.posizioni.length > 1) {
			let percorsoSvolto = new google.maps.Polyline({
				path: this.props.posizioni,
				geodesic: true,
				strokeColor: '#00a000',
				strokeOpacity: 1.0,
				strokeWeight: 4
			});
			percorsoSvolto.setMap(this.map);
		}

		if(this.props.spedizione.stato != StatoSpedizione.COMPLETATA) {
			let start;

			if(this.props.spedizione.stato == StatoSpedizione.IN_CORSO && this.props.posizioni.length > 0) {
				let lastPosizione = this.props.posizioni[this.props.posizioni.length-1];
				start = new google.maps.LatLng(lastPosizione.lat, lastPosizione.lng);
				this.addMarker(tappe[0].getMagazzino().indirizzo, "1", geocoder)
			} else  {
				start = tappe[0].getMagazzino().indirizzo;
			}

			let end = tappe[tappe.length-1].getMagazzino().indirizzo;


			this.makeRoute(start, end, waypoints, directionsService, directionsRenderer);
		} else {
			this.addMarker(tappe[0].getMagazzino().indirizzo, "1", geocoder);
			this.addMarker(tappe[tappe.length-1].getMagazzino().indirizzo, "" + (tappe.length), geocoder);
		}

	}

	makeRoute(start: string|google.maps.LatLng, end: string, waypoints: google.maps.DirectionsWaypoint[], directionsService: google.maps.DirectionsService, directionsRenderer: google.maps.DirectionsRenderer) {
		var request = {
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode.DRIVING,
			waypoints
		};
		directionsService.route(request, function(result, status) {
			if (status == "OK") {
				directionsRenderer.setDirections(result);
			}
		})
	}

	addMarker(address: string, label: string, geocoder: google.maps.Geocoder) {
		geocoder.geocode( { 'address': address}, (results, status) => {
			if (status == 'OK') {
				new google.maps.Marker({
					map: this.map,
					position: results[0].geometry.location,
					label,
					title: address
				});
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			}
		});
	}

	render() {
		const b = this.bundle.routes.visualizzaSpedizione
		const bo = this.bundle.domain.orderProperties
		const bs = this.bundle.domain.shipmentProperties

		return <App>
		<Drawer>
			<Typography variant="h3">{this.bundle.components.drawer.shipmentDetails} #{this.props.spedizione.id}</Typography>
			<ShipmentInfo spedizione={this.props.spedizione} />
			<div>
				<Grid container spacing={2} justify="space-between">
					<Grid item md={6}>
						<StageList propsType="compact" tappe={this.props.spedizione.getTappe()} />
					</Grid>
					<Grid item md={6}>
						<div id="map" ref="map" style={{width: "100%", height: "450px"}}>
						</div>
					</Grid>
				</Grid>
			</div>
			<div style={{...style.scrollBox, ...style.mt}}>
				{ this.props.spedizione.getOrdini().map((ordine) => <OrderItem key={ordine.id} ordine={ordine}/> )}
			</div>
			</Drawer>
			</App>
	}
}
