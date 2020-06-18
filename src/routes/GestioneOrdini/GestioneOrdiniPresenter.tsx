import GestioneOrdiniView from './GestioneOrdiniView'
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

  render() {
    return <GestioneOrdiniView />
  }
}