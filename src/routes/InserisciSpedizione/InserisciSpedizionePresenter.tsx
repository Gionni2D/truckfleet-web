import InserisciSpedizioneView, { ValidationError, ValidationResult } from './InserisciSpedizioneView'
import * as React from 'react'
import app from '../../app'
import { SpedizioneRaw, Camionista, Ordine, StatoOrdine, TappaRaw } from '../../domain'

interface PresenterState {
	spedizione: SpedizioneRaw,
	tappe: TappaRaw[],
	camionisti: Camionista[],
	partenza: number
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
			partenza: Date.now() + 1000*60*60*24,
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

	onInfoVeicoloInserted = () : ValidationResult => {
		const validation = this.validateVeicolo()
		if(validation.result && this.state.optimization) this.optimizeSpedizione()
		return { ...validation, arriviPrevisti: [] }
	}

	onAllInfoInserted = () : ValidationResult => {
		const {spedizione, tappe, partenza } = this.state
		const r = app.validaSpedizione(spedizione, tappe, partenza)

		if(r.result) {
			return { result: true, arriviPrevisti: r.arriviPrevisti }
		} else {
			return { result: false, errors: { error: r.error } }
		}
	}

	onCreateSpedizione = () => {
		const {spedizione, tappe, partenza } = this.state
		return app.inserisciSpedizione(spedizione, tappe, partenza)
	}

	onAddTappa = (tappa: TappaRaw) => {
		this.setState({
			tappe: [
				...this.state.tappe,
				tappa
			]
		});
	}

	onDeleteTappa = (tappa: TappaRaw) => {
		console.log(tappa);
		const tappe = this.state.tappe
			.filter(t => t.ordineItinerario != tappa.ordineItinerario)
			.map((t, i) => { t.ordineItinerario = i; return t })

		this.setState({ tappe });
	}

	onChangeSpedizione = (value: string, attributeName: keyof SpedizioneRaw) => {
		let spedizione = {...this.state.spedizione, [attributeName]: value};
		this.setState({ spedizione });
	}

	onChangeAutisti = (autisti: [Camionista, Camionista?]) => {
		const { spedizione } = this.state
		if(autisti[1] && autisti[0].userName == autisti[1].userName) autisti[1] = undefined
		spedizione.camionisti = autisti
		this.setState({ spedizione })
	}

	onChangePartenza = (partenza: number) => {
		this.setState({ partenza })
	}

	onHintOptimizationChange = (optimization: boolean) => this.setState({ optimization })

	render() {
		console.log("[InserisciSpedizionePresenter]", this.state);

		return <InserisciSpedizioneView
			optimization={this.state.optimization}
			spedizione={this.state.spedizione}
			camionisti={this.state.camionisti}
			ordini={this.state.ordini}
			tappe={this.state.tappe}
			partenza={this.state.partenza}
			onHintOptimizationChange={this.onHintOptimizationChange}
			onInfoVeicoloInserted={this.onInfoVeicoloInserted}
			onAllInfoInserted={this.onAllInfoInserted}
			onCreateSpedizione={this.onCreateSpedizione}
			onDeleteTappa={this.onDeleteTappa}
			onAddTappa={this.onAddTappa}
			onChangeSpedizione={this.onChangeSpedizione}
			onChangeAutisti={this.onChangeAutisti}
			onChangePartenza={this.onChangePartenza}/>
	}
}