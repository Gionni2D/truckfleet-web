import VisualizzaSpedizioneView from './VisualizzaSpedizioneView'
import * as React from 'react'
import app from '../../app'

interface PresenterState {
}

export interface VisualizzaSpedizionePresenterProps {
	id_spedizione: number
}

export default class VisualizzaSpedizionePresenter
	extends React.Component<VisualizzaSpedizionePresenterProps, PresenterState> {

	constructor(props: VisualizzaSpedizionePresenterProps) {
		super(props)
		this.state = {
		}
	}

	render() {
		console.log(this.props.id_spedizione);

		return <VisualizzaSpedizioneView />
	}
}