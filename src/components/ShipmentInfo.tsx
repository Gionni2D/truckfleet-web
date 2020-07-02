import { Card, CardContent, Grid, Typography } from '@material-ui/core'
import { SpedizioneRaw, StatoSpedizione } from '../domain'
import * as React from 'react'
import app from '../app'

interface ShipmentInfoProps {
  spedizione: SpedizioneRaw & { stato?: StatoSpedizione }
}

const bundle = app.getBundle()
const bs = bundle.domain.shipmentProperties

const style : { [key: string] : React.CSSProperties } = {
	card: {
		padding: 10,
		margin: "20px 0"
	},
	mt: {
		marginTop: 10
  }
}

export default function ShipmentInfo(props: ShipmentInfoProps) {
  const { spedizione } = props

  return (
    <Card style={style.card}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <div>
              <Typography variant="overline" color="textSecondary">{bs.drivers}:</Typography>
              <Typography variant="body2">
                { spedizione.camionisti.map((camionista) => camionista !== undefined ?
                    <span key={camionista.userName} style={{display: "block"}}>
                      {`${camionista.cognome} ${camionista.nome}`}
                    </span> :
                    undefined)
                }
              </Typography>
            </div>
            {spedizione.stato != undefined ?
              <div style={style.mt}>
                <Typography variant="overline" color="textSecondary">{bs.state}:</Typography>
                <Typography variant="body2">{bundle.domain.shipmentState[spedizione.stato]}</Typography>
              </div> :
              undefined
            }
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div>
              <Typography variant="overline" color="textSecondary">{bs.vehicle}:</Typography>
              <Typography variant="body2">{spedizione.veicoloModello} - {spedizione.veicoloTarga}</Typography>
            </div>
            <div style={style.mt}>
              <Typography variant="overline" color="textSecondary">{bs.unladenMass}:</Typography>
              <Typography variant="body2">{spedizione.veicoloMassa} t</Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div>
              <Typography variant="overline" color="textSecondary">{bs.trailer}:</Typography>
              <Typography variant="body2">{spedizione.rimorchioDimX} x {spedizione.rimorchioDimY} x {spedizione.rimorchioDimZ} cm</Typography>
            </div>
            <div style={style.mt}>
              <Typography variant="overline" color="textSecondary">{bs.trailer}:</Typography>
              <Typography variant="body2">{bs.unladenMass}: {spedizione.rimorchioMassa} t<br/>
                {bs.maxLoad}: {spedizione.rimorchioCaricoMax} t
              </Typography>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}