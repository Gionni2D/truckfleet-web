import GestioneOrdiniView, {FromGestioneOrdiniRoute} from './GestioneOrdiniView'
import * as React from 'react'
import app from '../../app'

interface PresenterState {
}

export default class GestioneOrdiniPresenter
  extends React.Component<{}, PresenterState> {

  constructor(props: {}) {
    super(props)
    this.state = {
    }
  }

  onChangeRoute = (route: FromGestioneOrdiniRoute) => {
    app.changeRoute({ route })
  }

  render() {
    return <GestioneOrdiniView
		onChangeRoute={this.onChangeRoute}/>
  }
}