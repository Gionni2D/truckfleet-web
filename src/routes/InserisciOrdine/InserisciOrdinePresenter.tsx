import InserisciOrdineView, {FromInserisciOrdineRoute} from './InserisciOrdineView'
import * as React from 'react'
import app from '../../app'

interface PresenterState {
}

export default class VisualizzaSpedizionePresenter
  extends React.Component<{}, PresenterState> {

  constructor(props: {}) {
    super(props)
    this.state = {
    }
  }

  onChangeRoute = (route: FromInserisciOrdineRoute) => {
    app.changeRoute({ route })
  }

  render() {
    return <InserisciOrdineView
		onChangeRoute={this.onChangeRoute}/>
  }
}