import { Typography, TextField, Grid, Button } from '@material-ui/core'
import { OrdineRaw, MagazzinoRaw, Magazzino } from '../../domain'
import Autocomplete from '@material-ui/lab/Autocomplete';
import Drawer from '../../components/Drawer'
import App from '../../components/App'
import { i18n } from '../../i18n'
import { RouteList } from '..'
import * as React from 'react'
import app from '../../app'

interface ViewProps {
	onChangeValue(value: string, attributeName: keyof OrdineRaw): void
	onChangeMagazzinoCarico(value: string): void
	onChangeMagazzinoScarico(value: string): void
	onSubmit(): boolean
	ordine: OrdineRaw
	magazzinoCarico: MagazzinoRaw
	magazzinoScarico: MagazzinoRaw
	magazzini: Magazzino[]
}

const style : { [key: string] : React.CSSProperties } = {
	mTitleContent: {
		marginTop: 20
	}
}

export type FromInserisciOrdineRoute =
	RouteList.GestioneOrdini |
	RouteList.Home

export default class InserisciOrdineView
	extends React.Component<ViewProps> {

	readonly bundle: i18n

	constructor(props: ViewProps) {
		super(props)
		this.bundle = app.getBundle()
	}

	onChangeValue = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
		if(!Object.keys(this.props.ordine).includes(e.target.name))
			throw new TypeError(`Object Ordine has not an attribute named '${e.target.name}'`);
		this.props.onChangeValue(e.target.value, e.target.name as keyof OrdineRaw);
	}

	onChangeMagazzinoCarico = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onChangeMagazzinoCarico(e.target.value);
	}

	onSelectMagazzinoCarico = (event: React.ChangeEvent<{}>, value: string | Magazzino | null) => {
		this.props.onChangeMagazzinoCarico((value as Magazzino).indirizzo);
	}

	onChangeMagazzinoScarico = (e: React.ChangeEvent<HTMLInputElement>) => {
		this.props.onChangeMagazzinoScarico(e.target.value);
	}

	onSelectMagazzinoScarico = (event: React.ChangeEvent<{}>, value: string | Magazzino | null) => {
		this.props.onChangeMagazzinoScarico((value as Magazzino).indirizzo);
	}

	onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		if(this.props.onSubmit())
			alert("Ordine inserito correttamente");
		else
			alert("Errore nell'inserimento dell'ordine");//TODO: dovrei dire se è un errore di validazione o un errore di inserimento, portandomi dietro non un bool ma qualcosa di più?
		e.preventDefault();
	}

	render() {
		const b = this.bundle.routes.inserisciOrdine
		const bo = this.bundle.domain.orderProperties

		return <App>
			<Drawer>
				<Typography variant="h3" >{b.title}</Typography>

				<div style={style.mTitleContent}>
					<form onSubmit={this.onSubmit}>
						<Grid container>
						<Grid item md={4}>
								<Typography variant="h5">{b.orderSection}</Typography>
								<div style={style.mTitleContent}>
									<TextField
										multiline
										inputProps={{ maxLength: 500 }}
										variant="outlined"
										name="descrizione"
										label={bo.desc}
										value={this.props.ordine.descrizione}
										onChange={this.onChangeValue}/><br/><br/>
									<TextField
										type="number"
										inputProps={{ min: 0, max: 44000, step: 0.001 }}
										variant="outlined"
										name="massa"
										label={`${bo.mass} (kg)`}
										value={this.props.ordine.massa}
										onChange={this.onChangeValue}/><br/><br/>
									<TextField
										size="small"
										type="number"
										inputProps={{ min: 1, max: 5000 }}
										variant="outlined"
										name="dimX"
										label="x (cm)"
										value={this.props.ordine.dimX}
										onChange={this.onChangeValue}/>
									<TextField
										size="small"
										type="number"
										inputProps={{ min: 1, max: 5000 }}
										variant="outlined"
										name="dimY"
										label="y (cm)"
										value={this.props.ordine.dimY}
										onChange={this.onChangeValue}/>
									<TextField
										size="small"
										type="number"
										inputProps={{ min: 1, max: 5000 }}
										variant="outlined"
										name="dimZ"
										label="z (cm)"
										value={this.props.ordine.dimZ}
										onChange={this.onChangeValue}/>
								</div>
							</Grid>
							<Grid item md={4}>
								<Typography variant="h5">{b.senderSection}</Typography>
								<div style={style.mTitleContent}>
									<TextField
										variant="outlined"
										name="nomeMittente"
										label={bo.from}
										value={this.props.ordine.nomeMittente}
										onChange={this.onChangeValue}/><br/><br/>
									<Autocomplete
										options={this.props.magazzini}
										getOptionLabel={(option) => option.indirizzo}
										style={{ width: 300 }}
										onChange={this.onSelectMagazzinoCarico}
										freeSolo
										renderInput={(params) => <TextField
											{...params}
											variant="outlined"
											label={bo.load}
											value={this.props.magazzinoCarico.indirizzo}
											onChange={this.onChangeMagazzinoCarico}/>}/>
								</div>
							</Grid>
							<Grid item md={4}>
								<Typography variant="h5">{b.receiverSection}</Typography>
								<div style={style.mTitleContent}>
									<TextField
										variant="outlined"
										name="nomeDestinatario"
										label={bo.to}
										value={this.props.ordine.nomeDestinatario}
										onChange={this.onChangeValue}/><br/><br/>
									<Autocomplete
										options={this.props.magazzini}
										getOptionLabel={(option) => option.indirizzo}
										style={{ width: 300 }}
										onChange={this.onSelectMagazzinoScarico}
										freeSolo
										renderInput={(params) => <TextField
											{...params}
											variant="outlined"
											label={bo.unload}
											value={this.props.magazzinoScarico.indirizzo}
											onChange={this.onChangeMagazzinoScarico}/>}/>
									<br/><br/>
									<Button
										size="large"
										type="submit"
										variant="contained"
										color="primary">
										{b.insert}
									</Button>
								</div>
							</Grid>
						</Grid>

					</form>
				</div>
			</Drawer>
		</App>
	}
}
