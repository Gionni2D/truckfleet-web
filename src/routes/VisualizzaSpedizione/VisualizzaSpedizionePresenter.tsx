import VisualizzaSpedizioneView from './VisualizzaSpedizioneView'
import * as React from 'react'
import app from '../../app'
import { Spedizione, Posizione } from '../../domain'
import { Unsubscribe } from 'redux'

interface PresenterState {
	spedizione: Spedizione,
	mapLoaded: boolean,
	posizioni: Posizione[]
}

export interface VisualizzaSpedizionePresenterProps {
	id_spedizione: number
}

export default class VisualizzaSpedizionePresenter
	extends React.Component<VisualizzaSpedizionePresenterProps, PresenterState> {

	private unsubscribe?: Unsubscribe

	constructor(props: VisualizzaSpedizionePresenterProps) {
		super(props)
		this.state = {
			spedizione: app.getSpedizioni((s) => s.id == this.props.id_spedizione)[0],
			mapLoaded: app.getState().mapLoaded,
			posizioni: app.getPosizioni(p => p.spedizioneId == this.props.id_spedizione)
		}
	}

	componentDidMount() {
		this.unsubscribe = app.subscribe(() => {
			this.setState({
				mapLoaded: app.getState().mapLoaded
			})
		})
	}

	componentWillUnmount() {
		if(this.unsubscribe) this.unsubscribe()
	}

	render() {
		console.log("m", this.state.mapLoaded);
		return <VisualizzaSpedizioneView
			mapLoaded={this.state.mapLoaded}
			spedizione={this.state.spedizione}
			posizioni={this.state.posizioni}/>
	}
}