import VisualizzaSpedizioneView from './VisualizzaSpedizioneView'
import * as React from 'react'
import app from '../../app'
import { Spedizione } from '../../domain'

interface PresenterState {
	spedizione: Spedizione
}

export interface VisualizzaSpedizionePresenterProps {
	id_spedizione: number
}

export default class VisualizzaSpedizionePresenter
	extends React.Component<VisualizzaSpedizionePresenterProps, PresenterState> {

	constructor(props: VisualizzaSpedizionePresenterProps) {
		super(props)
		this.state = {
			spedizione: app.getSpedizioni((s) => s.id == this.props.id_spedizione)[0]
		}
	}

	render() {
		console.log(this.props.id_spedizione);

		return <VisualizzaSpedizioneView
			spedizione={this.state.spedizione}/>
	}
}