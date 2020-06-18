import GestioneSpedizioniView from './GestioneSpedizioniView'
import * as React from 'react'
import app from '../../app'

interface PresenterState {
}

export default class GestioneSpedizioniPresenter
  extends React.Component<{}, PresenterState> {

  constructor(props: {}) {
    super(props)
    this.state = {
    }
  }

  render() {
    return <GestioneSpedizioniView />
  }
}