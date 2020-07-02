import * as React from 'react'
import { Grid, Typography, IconButton, Avatar } from '@material-ui/core'
import { Card, CardContent, CardHeader } from '@material-ui/core'
import ListAltIcon from '@material-ui/icons/ListAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import { Ordine, StatoOrdine } from '../domain';
import app from '../app';

export const OrderIcon = ListAltIcon

const style : { [key: string] : React.CSSProperties } = {
	card: {
		padding: 10,
		margin: "20px 0"
	},
	mt: {
		marginTop: 10
	}
}


interface OrderItemProps {
	ordine: Ordine
	onEliminaOrdine?(idOrdine: number): void
}



const bd = app.getBundle().domain

export default function OrderItem({ordine, onEliminaOrdine}: OrderItemProps) {

	return <Card style={style.card}>
	<CardHeader
		avatar={<Avatar><OrderIcon /></Avatar>}
		title={ordine.descrizione}
		subheader={<span>
			{bd.orderProperties.id}: <b>{ordine.id}</b><br/>
			{bd.orderProperties.state}: <b>{bd.orderState[ordine.stato]}</b>
		</span>}
		action={ onEliminaOrdine !== undefined && ordine.stato == StatoOrdine.INSERITO ?
			<IconButton
				onClick={onEliminaOrdine.bind(undefined, ordine.id)}>
				<DeleteIcon />
			</IconButton>:
			undefined
		}
		/>
	<CardContent>
		<Grid container spacing={2}>
			<Grid item xs={12} sm={6} md={4}>
				<div>
					<Typography variant="overline" color="textSecondary">{bd.orderProperties.from}:</Typography>
					<Typography variant="body2">{ordine.nomeMittente}</Typography>
				</div>
				<div style={style.mt}>
					<Typography variant="overline" color="textSecondary">{bd.orderProperties.to}:</Typography>
					<Typography variant="body2">{ordine.nomeDestinatario}</Typography>
				</div>
			</Grid>
			<Grid item xs={12} sm={6} md={4}>
				<div>
					<Typography variant="overline" color="textSecondary">{bd.orderProperties.load}:</Typography>
					<Typography variant="body2">{ordine.getInfoCarico()[0].indirizzo}</Typography>
				</div>
				<div style={style.mt}>
					<Typography variant="overline" color="textSecondary">{bd.orderProperties.unload}:</Typography>
					<Typography variant="body2">{ordine.getInfoScarico()[0].indirizzo}</Typography>
				</div>
			</Grid>
			<Grid item xs={12} sm={6} md={4}>
				<div>
					<Typography variant="overline" color="textSecondary">{bd.orderProperties.dimension}:</Typography>
					<Typography variant="body2">{ordine.dimX} x {ordine.dimY} x {ordine.dimZ} cm</Typography>
				</div>
				<div style={style.mt}>
					<Typography variant="overline" color="textSecondary">{bd.orderProperties.mass}:</Typography>
					<Typography variant="body2">{ordine.massa} kg</Typography>
				</div>
			</Grid>
		</Grid>
	</CardContent>
</Card>
}