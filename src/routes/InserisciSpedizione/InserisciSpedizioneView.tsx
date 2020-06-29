import { ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, ListItemSecondaryAction } from '@material-ui/core'
import { Typography, Grid, TextField, Button, Checkbox, IconButton } from '@material-ui/core'
import { List, ListItem, ListItemAvatar, Avatar, FormControlLabel } from '@material-ui/core'
import { SpedizioneRaw, Camionista, Ordine, TappaRaw, Magazzino, Tappa } from '../../domain'
import OrderItem, { OrderIcon } from '../../components/OrderItem'
import PositionIcon from '@material-ui/icons/Room'
import DeleteIcon from '@material-ui/icons/Delete'
import Drawer from '../../components/Drawer'
import App from '../../components/App'
import { i18n } from '../../i18n'
import * as React from 'react'
import app from '../../app'

interface ViewProps {
	spedizione: SpedizioneRaw,
	camionisti: Camionista[],
	optimization: boolean,
	tappe: TappaRaw[],
	ordini: Ordine[],
	onHintOptimizationChange(opt: boolean) : void
	onInfoVeicoloInserted() : ValidationResult
	onAllInfoInserted() : ValidationResult
	onCreateSpedizione() : boolean
	onDeleteTappa(tappa: TappaRaw) : void
	onAddTappa(tappa: TappaRaw) : void
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
	errors: ValidationError,
	modalOpen: boolean,
	modalValue: TappaRaw
	ordiniSelected: Ordine[],
	magazziniSelected: Magazzino[]
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
			magazziniSelected: []
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

	renderFirstStep = () => {
		const b = this.bundle.routes.inserisciSpedizione
		const bs = this.bundle.domain.shipmentProperties
		const { spedizione, optimization } = this.props
		const { errors } = this.state
		return (
			<form onSubmit={this.onInfoVeicoloInserted}>
				<Grid container spacing={2}>
					<Grid item xs={12} md={6}>
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
								onChange={this.onChangeSpedizione}/><br/><br/>
							<FormControlLabel
								control={
									<Checkbox
										checked={optimization}
										onChange={(_, checked) => this.props.onHintOptimizationChange(checked)} />
								}
								label={b.hintOptimizedShipment}/>
						</div>
					</Grid>
					<Grid item xs={12} md={6}>
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
		const bm = this.bundle.routes.inserisciSpedizione.modal
		const bo = this.bundle.domain.orderProperties
		const bs = this.bundle.domain.shipmentProperties
		const { modalOpen, modalValue, ordiniSelected, magazziniSelected, } = this.state
		const { tappe } = this.props

		return <form>
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
		</form>
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