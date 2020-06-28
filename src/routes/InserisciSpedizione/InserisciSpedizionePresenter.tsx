import InserisciSpedizioneView, { ValidationError } from './InserisciSpedizioneView'
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

	validateVeicolo() {
		const errors : ValidationError = {}
		const { spedizione } = this.state

		errors.veicoloModello = !spedizione.veicoloModello.trim()
		errors.veicoloTarga = !spedizione.veicoloTarga.trim()
		errors.veicoloMassa = spedizione.veicoloMassa < 1 || spedizione.veicoloMassa > 40000
		errors.rimorchioCaricoMax = spedizione.rimorchioCaricoMax < 1 || spedizione.rimorchioCaricoMax > 40000
		errors.rimorchioMassa = spedizione.rimorchioMassa < 1 || spedizione.rimorchioMassa > 40000
		errors.rimorchioDimX = spedizione.rimorchioDimX < 1 || spedizione.rimorchioDimX > 5000
		errors.rimorchioDimY = spedizione.rimorchioDimY < 1 || spedizione.rimorchioDimY > 5000
		errors.rimorchioDimZ = spedizione.rimorchioDimZ < 1 || spedizione.rimorchioDimZ > 5000

		const result = !(errors.veicoloMassa ||
			errors.veicoloModello ||
			errors.veicoloTarga ||
			errors.rimorchioCaricoMax ||
			errors.rimorchioMassa ||
			errors.rimorchioDimX ||
			errors.rimorchioDimY ||
			errors.rimorchioDimZ)

		return { result, errors }
	}

	onInfoVeicoloInserted = () => {
		const validation = this.validateVeicolo()
		if(validation.result && this.state.optimization) this.optimizeSpedizione()
		return validation
	}

	onAllInfoInserted = () => {
		// const {spedizione, tappe, dataInizio} = this.state
		// return app.validaSpedizione(spedizione, tappe, dataInizio)
		return { result: true, errors: {} }
	}

	onCreateSpedizione = () => {
		const {spedizione, tappe, dataInizio} = this.state
		return app.inserisciSpedizione(spedizione, tappe, dataInizio)
	}

	onChangeTappe = (tappe: TappaRaw[]) => {
		this.setState({ tappe });
	}

	onChangeSpedizione = (value: string, attributeName: keyof SpedizioneRaw) => {
		let spedizione = {...this.state.spedizione, [attributeName]: value};
		this.setState({ spedizione });
	}

	render() {
		return <InserisciSpedizioneView
			optimization={this.state.optimization}
			spedizione={this.state.spedizione}
			camionisti={this.state.camionisti}
			ordini={this.state.ordini}
			tappe={this.state.tappe}
			onInfoVeicoloInserted={this.onInfoVeicoloInserted}
			onAllInfoInserted={this.onAllInfoInserted}
			onCreateSpedizione={this.onCreateSpedizione}
			onChangeTappe={this.onChangeTappe}
			onChangeSpedizione={this.onChangeSpedizione}/>
	}
}