import InserisciSpedizioneView from './InserisciSpedizioneView'
import * as React from 'react'
import app from '../../app'
import { SpedizioneRaw, Camionista, Ordine, StatoOrdine, TappaRaw } from '../../domain'

interface PresenterState {
	spedizione: SpedizioneRaw,
	tappe: TappaRaw[],
	camionisti: Camionista[],
	dataInizio: number,
	optimization: boolean,
	ordini: Ordine[]
}

export default class InserisciSpedizionePresenter
	extends React.Component<{}, PresenterState> {

	constructor(props: {}) {
		super(props)

		const camionisti = app.getCamionisti();
		const ordini = app.getOrdini(o => o.stato == StatoOrdine.INSERITO);

		this.state = {
			camionisti,
			optimization: false,
			dataInizio: Date.now() + 1000*60*60*24,
			ordini,
			spedizione: {
				veicoloTarga: "",
				veicoloModello: "",
				veicoloMassa: 0,
				rimorchioDimX: 0,
				rimorchioDimY: 0,
				rimorchioDimZ: 0,
				rimorchioCaricoMax: 0,
				rimorchioMassa: 0,
				camionisti: [camionisti[0]]
			},
			tappe: []
		}
	}

	optimizeSpedizione() {
		// TODO
	}

	onInfoVeicoliInserted = () => {
		if(this.state.optimization) this.optimizeSpedizione()
	}

	onAllInfoInserted = () => {
		const {spedizione, tappe, dataInizio} = this.state
		return app.validaSpedizione(spedizione, tappe, dataInizio)
	}

	onCreateSpedizione = () => {
		const {spedizione, tappe, dataInizio} = this.state
		return app.inserisciSpedizione(spedizione, tappe, dataInizio)
	}

	render() {
		return <InserisciSpedizioneView
			optimization={this.state.optimization}
			spedizione={this.state.spedizione}
			camionisti={this.state.camionisti}
			ordini={this.state.ordini}
			tappe={this.state.tappe}
			onInfoVeicoloInserted={this.onInfoVeicoliInserted}
			onAllInfoInserted={this.onAllInfoInserted}
			onCreateSpedizione={this.onCreateSpedizione}/>
	}
}