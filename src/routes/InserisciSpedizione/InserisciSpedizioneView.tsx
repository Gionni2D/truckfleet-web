import { i18n } from '../../i18n'
import * as React from 'react'
import app from '../../app'
import App from '../../components/App'
import Drawer from '../../components/Drawer'
import { SpedizioneRaw, Camionista, Ordine, TappaRaw } from '../../domain'
import { Typography, Grid, TextField, Button } from '@material-ui/core'

interface ViewProps {
	spedizione: SpedizioneRaw,
	camionisti: Camionista[],
	optimization: boolean,
	tappe: TappaRaw[],
	ordini: Ordine[],
	onInfoVeicoloInserted() : ValidationResult
	onAllInfoInserted() : ValidationResult
	onCreateSpedizione() : boolean
	onChangeTappe(tappe: TappaRaw[]) : void
	onChangeSpedizione(value: string, attributeName: keyof SpedizioneRaw): void
}

export type ValidationResult = {
	result: boolean,
	errors: ValidationError
}

export type ValidationError = {
	[key in keyof SpedizioneRaw]?: boolean
}

type ViewStep = 0 | 1 | 2

interface ViewState {
	step: ViewStep,
	errors: ValidationError
}

const style : { [key: string] : React.CSSProperties } = {
	mTitleContent: {
		marginTop: 20
	}
}

export default class InserisciSpedizioneView
	extends React.Component<ViewProps, ViewState> {

	readonly bundle: i18n
	private  StepComponent : (() => React.ReactNode)[]

	constructor(props: ViewProps) {
		super(props)
		this.bundle = app.getBundle()
		this.state = {
			step: 0,
			errors: {}
		}
		this.StepComponent = [
			this.renderFirstStep,
			this.renderSecondStep,
			this.renderThirdStep,
		]
	}

	onInfoVeicoloInserted = (e: React.FormEvent) => {
		e.preventDefault()
		const validation = this.props.onInfoVeicoloInserted()

		if(validation.result) this.setState({ step: 1, errors: {} })
		else this.setState({ errors: validation.errors })
	}

	onAllInfoInserted = () => {
		if(this.props.onAllInfoInserted()) {
			this.setState({ step: 2 })
		}
	}

	onCreateSpedizione = () => {
		const b = this.bundle.routes.inserisciSpedizione
		if(this.props.onCreateSpedizione()) {
			alert(b.insertComplete)
			// TODO: change location
		}
	}

	onChangeSpedizione = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
		if(!Object.keys(this.props.spedizione).includes(e.target.name))
			throw new TypeError(`Object Spedizione has not an attribute named '${e.target.name}'`);
		this.props.onChangeSpedizione(e.target.value, e.target.name as keyof SpedizioneRaw);
	}

	renderFirstStep = () => {
		const b = this.bundle.routes.inserisciSpedizione
		const bs = this.bundle.domain.shipmentProperties
		const { spedizione } = this.props
		const { errors } = this.state
		return (
			<form onSubmit={this.onInfoVeicoloInserted}>
				<Grid container spacing={2}>
					<Grid item md={6}>
						<Typography variant="h5">{b.vehicleSection}</Typography>
						<div style={style.mTitleContent}>
							<TextField
								variant="outlined"
								name="veicoloTarga"
								error={errors.veicoloTarga}
								label={bs.vehiclePlate}
								value={spedizione.veicoloTarga}
								onChange={this.onChangeSpedizione}/><br/><br/>
							<TextField
								variant="outlined"
								name="veicoloModello"
								error={errors.veicoloModello}
								label={bs.vehicleModel}
								value={spedizione.veicoloModello}
								onChange={this.onChangeSpedizione}/><br/><br/>
							<TextField
								type="number"
								inputProps={{ min: 1, max: 40000 }}
								variant="outlined"
								name="veicoloMassa"
								error={errors.veicoloMassa}
								label={bs.vehicleWeight}
								value={spedizione.veicoloMassa}
								onChange={this.onChangeSpedizione}/>
						</div>
					</Grid>
					<Grid item md={6}>
						<Typography variant="h5">{b.trailerSection}</Typography>
						<div style={style.mTitleContent}>
							<TextField
								type="number"
								inputProps={{ min: 1, max: 40000 }}
								variant="outlined"
								name="rimorchioMassa"
								error={errors.rimorchioMassa}
								label={bs.unladenMass}
								value={spedizione.rimorchioMassa}
								onChange={this.onChangeSpedizione}/>
							<TextField
								type="number"
								inputProps={{ min: 1, max: 40000 }}
								variant="outlined"
								name="rimorchioCaricoMax"
								error={errors.rimorchioCaricoMax}
								label={bs.maxLoad}
								value={spedizione.rimorchioCaricoMax}
								onChange={this.onChangeSpedizione}/><br/><br/>
							<Typography variant="subtitle2" color="textSecondary">
								{bs.trailerDim}
							</Typography><br/>
							<TextField
										size="small"
										type="number"
										inputProps={{ min: 1, max: 5000 }}
										variant="outlined"
										name="rimorchioDimX"
										error={errors.rimorchioDimX}
										label="x (cm)"
										value={spedizione.rimorchioDimX}
										onChange={this.onChangeSpedizione}/>
									<TextField
										size="small"
										type="number"
										inputProps={{ min: 1, max: 5000 }}
										variant="outlined"
										name="rimorchioDimY"
										error={errors.rimorchioDimY}
										label="y (cm)"
										value={spedizione.rimorchioDimY}
										onChange={this.onChangeSpedizione}/>
									<TextField
										size="small"
										type="number"
										inputProps={{ min: 1, max: 5000 }}
										variant="outlined"
										name="rimorchioDimZ"
										error={errors.rimorchioDimZ}
										label="z (cm)"
										value={spedizione.rimorchioDimZ}
										onChange={this.onChangeSpedizione}/><br/><br/>
						</div>
						<Button
							size="large"
							type="submit"
							variant="contained"
							color="primary">
							{b.next}
						</Button>
					</Grid>
				</Grid>
			</form>
		)
	}

	renderSecondStep = () => {
		const b = this.bundle.routes.inserisciSpedizione
		return <div>Second Step</div>
	}

	renderThirdStep = () => {
		const b = this.bundle.routes.inserisciSpedizione
		return <div>Third Step</div>
	}


	render() {
		const b = this.bundle.routes.inserisciSpedizione

		return <App>
			<Drawer>
				<Typography variant="h3" >{b.title}</Typography>
				<div style={style.mTitleContent}>
					{ this.StepComponent[this.state.step]() }
				</div>
			</Drawer>
		</App>
	}
}