import { Button, Typography, Divider, makeStyles, Theme, createStyles } from '@material-ui/core'
import Drawer from '../../components/Drawer'
import App from '../../components/App'
import { i18n } from '../../i18n'
import { RouteList } from '..'
import * as React from 'react'
import app from '../../app'

const useStlyes = makeStyles((theme: Theme) => createStyles({
	title: {
		marginBottom: theme.spacing(3)
	},
	section: {
		padding: theme.spacing(3, 0)
	}
}))

interface ViewProps {
	onChangeRoute(route: FromHomeRoute) : void
}

export type FromHomeRoute =
	RouteList.GestioneOrdini |
	RouteList.GestioneSpedizioni

export default function HomeView(props: ViewProps) {

	const bundle = app.getBundle()
	const classes = useStlyes()
	const b = app.getBundle().routes.home

	const onChangeRoute = (route: FromHomeRoute) => {
		props.onChangeRoute(route)
	}

	return <App>
		<Drawer >
			<Typography
				className={classes.title}
				variant="h3">
				{b.title}
			</Typography>

			<Divider />

			<div className={classes.section}>
				<Button
					onClick={onChangeRoute.bind(undefined, RouteList.GestioneOrdini)}
					variant="outlined"
					color="primary">
					{b.orderManagementButton}
				</Button>
				<br/><br/>
				<Typography>{b.orderManagementText}</Typography>
			</div>

			<Divider />

			<div className={classes.section}>
				<Button
					onClick={onChangeRoute.bind(undefined, RouteList.GestioneSpedizioni)}
					variant="outlined"
					color="primary">
					{b.shipmentManagementButton}
				</Button>
				<br/><br/>
				<Typography>{b.shipmentManagementText}</Typography>
			</div>

		</Drawer>
	</App>
}