import HomeView, { FromHomeRoute } from './HomeView'
import * as React from 'react'
import app from '../../app'

interface PresenterState {

}

export default class HomePresenter
  extends React.Component<{}, PresenterState> {

  constructor(props: {}) {
    super(props)
    this.state = {

    }
  }

  onChangeRoute = (route: FromHomeRoute) => {
    app.changeRoute({ route })
  }

  render() {
    return <HomeView
      onChangeRoute={this.onChangeRoute}/>
  }
}