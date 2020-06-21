import GestioneOrdiniView, {FromGestioneOrdiniRoute} from './GestioneOrdiniView'
import * as React from 'react'
import app from '../../app'
import { Ordine } from '../../domain'

interface PresenterState {
  ordini: Ordine[]
}

export default class GestioneOrdiniPresenter
  extends React.Component<{}, PresenterState> {

  constructor(props: {}) {
    super(props)
    this.state = {
      ordini: []
    }
  }

  componentDidMount() {
    this.setState({
      ordini: app.getOrdini()
    })
  }

  onChangeRoute = (route: FromGestioneOrdiniRoute) => {
    app.changeRoute({ route })
  }

  render() {
    return <GestioneOrdiniView
    ordini={this.state.ordini}
		onChangeRoute={this.onChangeRoute}/>
  }
}