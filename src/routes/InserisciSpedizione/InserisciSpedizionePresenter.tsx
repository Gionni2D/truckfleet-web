import InserisciSpedizioneView from './InserisciSpedizioneView'
import * as React from 'react'
import app from '../../app'

interface PresenterState {
}

export default class InserisciSpedizionePresenter
  extends React.Component<{}, PresenterState> {

  constructor(props: {}) {
    super(props)
    this.state = {
    }
  }

  render() {
    return <InserisciSpedizioneView />
  }
}