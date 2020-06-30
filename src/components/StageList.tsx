import * as React from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core'
import { Card, CardContent, Typography } from '@material-ui/core'
import { formatDate } from '../utils'
import { Tappa } from '../domain'
import app from '../app'

interface CompactProps {
  propsType: "compact"
  tappe: Tappa[]
}

interface ExpanseProps {
  propsType: "expanse"
  data: {
    id?: number
    indirizzo: string,
    arrivoPrevisto: number,
    arrivoEffettivo?: number
  }[]
}

type StageListProps = CompactProps | ExpanseProps

const expandProps = ({ tappe }: CompactProps) : ExpanseProps['data'] => {
  return tappe.map(tappa => ({
    id: tappa.id,
    indirizzo: tappa.getMagazzino().indirizzo,
    arrivoPrevisto: tappa.arrivoPrevisto,
    arrivoEffettivo: tappa.arrivoEffettivo
  }))
}

const bt = app.getBundle().domain.stageProperties

export default function StageList(props: StageListProps) {
  let data = props.propsType == "compact" ?
      expandProps(props) : props.data;

  return (
    <Card>
      <CardContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle2">{bt.indirizzo}</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">{bt.arrivoPrevisto}</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">{bt.arrivoEffettivo}</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { data.map((tappa, i) => {
              const isArrived = tappa.arrivoEffettivo !== undefined;
              return (<TableRow key={tappa.id ? tappa.id : i}>
                <TableCell>
                  <Typography variant="body2">
                    {isArrived ? '\u25A3' : '\u25A2'} {tappa.indirizzo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(tappa.arrivoPrevisto)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {isArrived && formatDate(tappa.arrivoEffettivo as number)}
                  </Typography>
                </TableCell>
              </TableRow>)
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}