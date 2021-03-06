import { SpedizioneValida, SpedizioneNonValidaError, InserisciSpedizioneResult } from '../../domain'
import { SpedizioneRaw, Camionista, Ordine, TappaRaw, Magazzino } from '../../domain'
import { ListItemSecondaryAction, Select, MenuItem, FormControl, InputLabel } from '@material-ui/core'
import { ListItemText, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core'
import { Typography, Grid, TextField, Button, Checkbox, IconButton } from '@material-ui/core'
import { List, ListItem, ListItemAvatar, Avatar, FormControlLabel } from '@material-ui/core'
import { parseInputDateTime, formatInputDateTime } from '../../utils'
import OrderItem, { OrderIcon } from '../../components/OrderItem'
import PositionIcon from '@material-ui/icons/Room'
import DeleteIcon from '@material-ui/icons/Delete'
import Drawer from '../../components/Drawer'
import Alert from '@material-ui/lab/Alert';
import App from '../../components/App'
import { i18n } from '../../i18n'
import * as React from 'react'
import app from '../../app'
import StageList from '../../components/StageList'
import ShipmentInfo from '../../components/ShipmentInfo'

interface ViewProps {
	spedizione: SpedizioneRaw,
	camionisti: Camionista[],
	optimization: boolean,
	tappe: TappaRaw[],
	ordini: Ordine[],
	partenza: number,
	onInfoVeicoloInserted() : ValidationResult
	onValidateSpedizione() : ValidationResult
	onCreateSpedizione() : InserisciSpedizioneResult
	onDeleteTappa(tappa: TappaRaw) : void
	onAddTappa(tappa: TappaRaw) : void
	onChangeOptimization(opt: boolean) : void
	onChangeSpedizione(value: string, attributeName: keyof SpedizioneRaw): void
	onChangeAutisti(autisti: [Camionista, Camionista?]) : void
	onChangePartenza(partenza: number) : void
}

export type ValidationResult = {
	result: false,
	errors: ValidationError
} | SpedizioneValida

export type ValidationError = {
	[key in keyof SpedizioneRaw]?: boolean
} & {
	error?: SpedizioneNonValidaError
}

type ViewStep = 0 | 1 | 2

interface ViewState {
	step: ViewStep,
	errors: ValidationError,
	modalOpen: boolean,
	modalValue: TappaRaw
	ordiniSelected: Ordine[],
	magazziniSelected: Magazzino[],
	arriviPrevisti: number[]
}

const style : { [key: string] : React.CSSProperties } = {
	mTitleContent: {
		marginTop: 20
	},
	scrollBox: {
		width: '100%',
		height: '300px',
		flexWrap: 'unset',
		overflowY: 'scroll',
		overflowX: 'hidden'
	},
	titleActionBox: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	orderBox: {
		display: 'flex'
	},
	warehouseSelected: {
		color: 'green'
	},
	row: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	alert: {
		position: 'fixed',
		width: '80%',
		zIndex: 3
	},
	w150: {
		width: '150px'
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
			errors: {},
			modalOpen: false,
			modalValue: InserisciSpedizioneView.getEmptyTappaRaw(props),
			ordiniSelected: [],
			magazziniSelected: [],
			arriviPrevisti: []
		}
		this.StepComponent = [
			this.renderFirstStep,
			this.renderSecondStep,
			this.renderThirdStep,
		]
	}

	static getEmptyTappaRaw = (props: ViewProps) : TappaRaw => ({
		magazzinoId: -1,
		ordineItinerario: props.tappe.length,
		ordini: []
	})

	getAddress = (magazzinoId: number) => {
		const { magazziniSelected } = this.state
		return magazziniSelected.filter(m => m.id == magazzinoId)[0].indirizzo
	}

	getOrdine = (ordini: Ordine[], id: number) => {
		return ordini.find(o => o.id == id)
	}

	ordiniTappeToString = (ordiniTappa: [string, number][]) => {
		const bo = this.bundle.domain.orderProperties
		const { ordiniSelected } = this.state
		return ordiniTappa
			.map(o => [o[0], this.getOrdine(ordiniSelected, o[1]) as Ordine ] as [string, Ordine])
			.reduce((r, o) => `[${o[0]}] ${bo.id}: ${o[1].id}; ${r}`, '')
	}

	onBack = () => {
		let { step } = this.state
		if(step > 0) step--
		this.setState({ step })
	}

	onInfoVeicoloInserted = (e: React.FormEvent) => {
		e.preventDefault()
		const validation = this.props.onInfoVeicoloInserted()

		if(validation.result) this.setState({ step: 1, errors: {} })
		else this.setState({ errors: validation.errors })
	}

	onValidateSpedizione = (e: React.FormEvent) => {
		e.preventDefault()
		const r = this.props.onValidateSpedizione()
		if(r.result) {
			this.setState({ step: 2, arriviPrevisti: r.arriviPrevisti })
			return
		}
		else {
			this.setState({ errors: r.errors })
		}
	}

	onCreateSpedizione = () => {
		const b = this.bundle.routes.inserisciSpedizione
		const r = this.props.onCreateSpedizione()
		if(r.result) {
			alert(b.insertComplete)
		}
	}

	onChangeSpedizione = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
		if(!Object.keys(this.props.spedizione).includes(e.target.name))
			throw new TypeError(`Object Spedizione has not an attribute named '${e.target.name}'`);
		this.props.onChangeSpedizione(e.target.value, e.target.name as keyof SpedizioneRaw);
	}

	onSelectOrder = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
		let { ordiniSelected } = this.state;
		const { ordini } = this.props
		const oId = parseInt(e.target.name)

		if(checked) ordiniSelected.push(ordini.filter(o => o.id == oId)[0])
		else ordiniSelected = ordiniSelected.filter(o => o.id != oId)

		const magazziniSelected = [
			...ordiniSelected.map(o => o.getInfoCarico()[0]),
			...ordiniSelected.map(o => o.getInfoScarico()[0])
		].filter((m, i, array) => array.indexOf(m) == i)

		this.setState({ ordiniSelected, magazziniSelected })
	}

	onOpenModal = () => {
		this.setState({
			modalOpen: true,
			modalValue: InserisciSpedizioneView.getEmptyTappaRaw(this.props)
		})
	}

	onCloseModal = () => {
		this.setState({ modalOpen: false })
	}

	onSelectTappaAddress = (magazzinoId: number) => {
		const { modalValue: value } = this.state

		if(value.magazzinoId === magazzinoId) return

		this.setState({
			modalValue: {
				...value,
				magazzinoId,
				ordini: []
			}
		})
	}

	onSelectTappaOrdine = (o: ['carico' | 'scarico', Ordine]) => {
		const { modalValue } = this.state
		const ot = [o[0], o[1].id] as ['carico' | 'scarico', number]

		this.setState({
			modalValue: {
				...modalValue,
				ordini: [
					...modalValue.ordini,
					ot
				]
			}
		})
	}

	isMagazzinoOrdineSelected = (o: Ordine, l: 'carico' | 'scarico') => {
		const { tappe } = this.props;
		return tappe
			.reduce((p, t) => p || t.ordini                       // riduco per ogni tappa
					.filter(ot => ot[0] == l)                         // filtro solo per il tipo di magazzino interessato
					.reduce((p1, ot) => p1 || ot[1] == o.id , false), // riduco per ogni ordine di una tappa
				false)
	}

	isTappaOrdineSelected = (o: Ordine) => {
		return this.state.modalValue.ordini
			.reduce((p, ot) => p || ot[1] == o.id, false)
	}

	onAddTappa = () => {
		const { modalValue: newTappa } = this.state

		this.props.onAddTappa(newTappa)
		this.setState({
			modalOpen: false,
			modalValue: InserisciSpedizioneView.getEmptyTappaRaw(this.props)
		})
	}

	onDeleteTappa = (t: TappaRaw) => {
		this.props.onDeleteTappa(t);
	}

	onChangeAutista = (userName: string, i: 0 | 1) => {
		const autisti = this.props.spedizione.camionisti
		const { camionisti } = this.props
		autisti[i] = camionisti.find(c => c.userName == userName) as Camionista
		this.props.onChangeAutisti(autisti)
	}

	onChangePartenza = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onChangePartenza(parseInputDateTime(e.target.value))
	}

	areTappeComplete = () => {
		const { ordiniSelected } = this.state
		return ordiniSelected.length > 0 &&
			ordiniSelected.reduce((p, o) => p &&
				this.isMagazzinoOrdineSelected(o, 'carico') &&
				this.isMagazzinoOrdineSelected(o, 'scarico'), true)
	}

	renderFirstStep = () => {
		const b = this.bundle.routes.inserisciSpedizione
		const bs = this.bundle.domain.shipmentProperties
		const { spedizione, optimization } = this.props
		const { errors } = this.state
		return (
			<form onSubmit={this.onInfoVeicoloInserted}>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
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
								style={style.w150}
								error={errors.veicoloMassa}
								label={`${bs.vehicleWeight} (t)`}
								value={spedizione.veicoloMassa}
								onChange={this.onChangeSpedizione}/><br/><br/>
							<FormControlLabel
								control={
									<Checkbox
										checked={optimization}
										onChange={(_, checked) => this.props.onChangeOptimization(checked)} />
								}
								label={b.hintOptimizedShipment}/>
						</div>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Typography variant="h5">{b.trailerSection}</Typography>
						<div style={style.mTitleContent}>
							<TextField
								type="number"
								inputProps={{ min: 1, max: 40000 }}
								variant="outlined"
								name="rimorchioMassa"
								style={style.w150}
								error={errors.rimorchioMassa}
								label={`${bs.unladenMass} (t)`}
								value={spedizione.rimorchioMassa}
								onChange={this.onChangeSpedizione}/>
							<TextField
								type="number"
								inputProps={{ min: 1, max: 40000 }}
								variant="outlined"
								name="rimorchioCaricoMax"
								style={style.w150}
								error={errors.rimorchioCaricoMax}
								label={`${bs.maxLoad} (t)`}
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
		const bm = this.bundle.routes.inserisciSpedizione.modal
		const bo = this.bundle.domain.orderProperties
		const bs = this.bundle.domain.shipmentProperties
		const { modalOpen, modalValue, ordiniSelected, magazziniSelected } = this.state
		const { camionisti, tappe, partenza } = this.props
		const { spedizione: { camionisti: autisti } } = this.props

		return <form onSubmit={this.onValidateSpedizione}>
			<Grid container >
				<Grid item xs={12} md={6}>
					<Typography variant="h5">{b.ordersSection}</Typography>
					<div style={{...style.scrollBox, ...style.mTitleContent}}>
						{ this.props.ordini.map(o => <div key={o.id} style={style.orderBox}>
							<Checkbox
								onChange={this.onSelectOrder}
								name={`${o.id}`}
								color="primary"/>
							<OrderItem ordine={o} />
						</div>)}
					</div>
				</Grid>
				<Grid item xs={12} md={6}>
					<Typography variant="h5">{b.warehouse}</Typography>
					<div style={{...style.scrollBox, ...style.mTitleContent}}>
						<List>
							{ this.state.ordiniSelected.map(o => {
									const cSel = this.isMagazzinoOrdineSelected(o, 'carico')
									const sSel = this.isMagazzinoOrdineSelected(o, 'scarico')
									const selected = style.warehouseSelected
									return <ListItem key={o.id}>
										<ListItemAvatar>
											<Avatar style={cSel && sSel ? selected : undefined}>
												<PositionIcon/>
											</Avatar>
										</ListItemAvatar>
										<ListItemText
											primary={
												<span style={cSel ? selected : undefined}>
													{o.getInfoCarico()[0].indirizzo}
												</span>
											}
											secondary={
												<span style={sSel ? selected : undefined}>
													{o.getInfoScarico()[0].indirizzo}
												</span>
											}
											/>
									</ListItem>
								})
							}
						</List>
					</div>
				</Grid>
			</Grid>
			<Grid container>
				<Grid item xs={12} md={12}>
					<div style={{...style.titleActionBox, ...style.mTitleContent}}>
						<Typography variant="h5">{b.stageSection}</Typography>
						<Button
							disabled={ordiniSelected.length == 0}
							onClick={this.onOpenModal}
							variant="outlined">
							{b.addStageButton}
						</Button>
					</div>
					<div style={{...style.scrollBox, ...style.mTitleContent}}>
						<List>
							{ tappe.map(t => (
									<ListItem key={`${t.magazzinoId}.${t.ordineItinerario}`}>
										<ListItemAvatar>
											<Avatar alt="load"><PositionIcon/></Avatar>
										</ListItemAvatar>
										<ListItemText
											primary={`${t.ordineItinerario+1}° ${bs.stage}: ${this.getAddress(t.magazzinoId)}`}
											secondary={this.ordiniTappeToString(t.ordini)}/>
										<ListItemSecondaryAction>
											<IconButton onClick={() => this.onDeleteTappa(t)}>
												<DeleteIcon />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								))
							}
						</List>
					</div>
				</Grid>
			</Grid>
			<Dialog
				fullWidth
				maxWidth="xl"
				open={modalOpen}
				onClose={this.onCloseModal}>
				<DialogTitle>{bm.title}</DialogTitle>
				<DialogContent>
					<Grid container>
						<Grid item xs={12} sm={6}>
							<Typography variant="h5" style={style.mTitleContent}>{bm.addressSection}</Typography>
							<div style={{...style.scrollBox, ...style.mTitleContent}}>
								<List>
									{ magazziniSelected.map(m => (
											<ListItem
												key={m.id}
												selected={m.id == modalValue.magazzinoId}
												onClick={() => this.onSelectTappaAddress(m.id)}>
												<ListItemAvatar>
													<Avatar><PositionIcon/></Avatar>
												</ListItemAvatar>
												<ListItemText
													primary={m.indirizzo}/>
											</ListItem>
										)
									)}
								</List>
							</div>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Typography variant="h5" style={style.mTitleContent}>{bm.ordersSection}</Typography>
							<div style={{...style.scrollBox, ...style.mTitleContent}}>
								<List>
									{ (ordiniSelected
											.map(o => [
												modalValue.magazzinoId == o.magazzinoCaricoId ? 'carico' :
												modalValue.magazzinoId == o.magazzinoScaricoId ? 'scarico' : undefined,
												o
											] as ['carico' | 'scarico' | undefined, Ordine])
											.filter(ot => !!ot[0]) as ['carico' | 'scarico', Ordine][])
											.filter(ot => ot[0] == 'carico' ?
												!this.isMagazzinoOrdineSelected(ot[1], 'carico') :
												this.isMagazzinoOrdineSelected(ot[1], 'carico') && !this.isMagazzinoOrdineSelected(ot[1], 'scarico'))
											.map(ot => (
												<ListItem
													key={ot[1].id}
													selected={this.isTappaOrdineSelected(ot[1])}
													onClick={() => this.onSelectTappaOrdine(ot)}>
													<ListItemAvatar>
														<Avatar><OrderIcon/></Avatar>
													</ListItemAvatar>
													<ListItemText
														primary={`[${ot[0]}] ${bo.id}: ${ot[1].id}`}
														secondary={ot[1].descrizione}/>
												</ListItem>
										)
									)}
								</List>
							</div>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button color="default" onClick={this.onCloseModal}>{bm.cancel}</Button>
					<Button
						color="primary"
						disabled={!modalValue.ordini.length}
						onClick={this.onAddTappa}>
						{bm.ok}
					</Button>
				</DialogActions>
			</Dialog>
			<Typography style={style.mTitleContent} variant="h5">{b.otherSection}</Typography>
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6} md={4} style={{...style.mTitleContent}}>
					<FormControl variant="outlined">
						<InputLabel>{bs.mainDriver}</InputLabel>
						<Select
							style={{minWidth: '200px'}}
							label={bs.mainDriver}
							value={autisti[0].userName}
							onChange={({ target }) => this.onChangeAutista(target.value as string, 0)}>
							<MenuItem disabled value=""><em>None</em></MenuItem>
							{ camionisti.map(c => (
								<MenuItem key={c.userName} value={c.userName}>
									<em>{c.cognome} {c.nome}</em>
								</MenuItem>
								))
							}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6} md={4} style={{...style.mTitleContent}}>
					<FormControl variant="outlined">
						<InputLabel>{bs.supportDriver}</InputLabel>
						<Select
							style={{minWidth: '200px'}}
							label={bs.supportDriver}
							value={autisti[1] ? autisti[1].userName : ""}
							onChange={({ target }) => this.onChangeAutista(target.value as string, 1)}>
							<MenuItem disabled value=""><em>None</em></MenuItem>
							{ camionisti
									.filter(c => c.userName != autisti[0].userName)
									.map(c => (
										<MenuItem key={c.userName} value={c.userName}>
											<em>{c.cognome} {c.nome}</em>
										</MenuItem>
									))
							}
						</Select>
					</FormControl>
				</Grid>
				<Grid item xs={12} sm={6} md={4} style={{...style.mTitleContent}}>
					<TextField
						variant="outlined"
						label={bs.departureDate}
						type="datetime-local"
						value={formatInputDateTime(partenza)}
						onChange={this.onChangePartenza}
						InputLabelProps={{
							shrink: true,
						}}/>
				</Grid>
			</Grid>
			<div style={{...style.mTitleContent, ...style.row}}>
				<Button
					size="large"
					variant="contained"
					onClick={this.onBack}>{b.back}</Button>
				<Button
					size="large"
					variant="contained"
					color="primary"
					disabled={!this.areTappeComplete()}
					type="submit">{b.insertButton}</Button>
			</div>
		</form>
	}

	renderThirdStep = () => {
		const b = this.bundle.routes.inserisciSpedizione
		const { tappe, spedizione } = this.props
		const { arriviPrevisti, ordiniSelected } = this.state
		const tappeData = tappe.map((t, i) => ({
			indirizzo: this.getAddress(t.magazzinoId),
			arrivoPrevisto: arriviPrevisti[i]
		}))

		return <form onSubmit={this.onCreateSpedizione}>
			<Typography variant="h5">{b.summarySection}</Typography>
			<Grid container spacing={2} justify="space-between">
				<Grid item xs={12}>
					<ShipmentInfo spedizione={spedizione}/>
				</Grid>
				<Grid item xs={12} md={6} style={style.mTitleContent}>
					<StageList propsType="expanse" data={tappeData} />
				</Grid>
				<Grid item xs={12} md={6}>
					<div style={{...style.scrollBox, ...style.mTitleContent}}>
						{ ordiniSelected.map(o => <OrderItem key={o.id} ordine={o} />) }
					</div>
				</Grid>
			</Grid>
			<div style={{...style.mTitleContent, ...style.row}}>
				<Button
					size="large"
					variant="contained"
					onClick={this.onBack}>{b.back}</Button>
				<Button
					size="large"
					variant="contained"
					color="primary"
					type="submit">{b.insertButton}</Button>
			</div>
		</form>
	}


	render() {
		const b = this.bundle.routes.inserisciSpedizione
		const { error, ...errors } = this.state.errors

		return <App>
			<Drawer>
				{ !error ? undefined :
						<Alert
							style={style.alert}
							severity="error"
							onClose={() => this.setState({ errors })}>
							{b.errors[error]}
						</Alert>
				}
				<Typography variant="h3" >{b.title}</Typography>
				<div style={style.mTitleContent}>
					{ this.StepComponent[this.state.step]() }
				</div>
			</Drawer>
		</App>
	}
}