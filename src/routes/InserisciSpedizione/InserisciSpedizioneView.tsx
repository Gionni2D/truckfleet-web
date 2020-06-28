import { i18n } from '../../i18n'
import * as React from 'react'
import app from '../../app'
import App from '../../components/App'
import Drawer from '../../components/Drawer'
import { SpedizioneRaw, Camionista, Ordine, TappaRaw } from '../../domain'

interface ViewProps {
	spedizione: SpedizioneRaw,
	camionisti: Camionista[],
	optimization: boolean,
	tappe: TappaRaw[],
	ordini: Ordine[],
	onInfoVeicoloInserted() : void,
	onAllInfoInserted() : boolean
	onCreateSpedizione() : boolean
}

interface ViewState {
	step: 0 | 1,
}

const StepComponent : React.ReactNode[] = []

StepComponent[0] = <div>Step1</div>
StepComponent[1] = <div>Step2</div>

export default class InserisciSpedizioneView
	extends React.Component<ViewProps, ViewState> {

	readonly bundle: i18n

	constructor(props: ViewProps) {
		super(props)
		this.bundle = app.getBundle()
		this.state = { step: 0 }
	}



	render() {
		const b = this.bundle.routes.inserisciSpedizione

		return <App>
			<Drawer>
				{ StepComponent[this.state.step] }
			</Drawer>
		</App>
	}
}