import { i18n } from '../../i18n'
import * as React from 'react'
import app from '../../app'

interface ViewProps {
}

export default class VisualizzaSpedizioneView
  extends React.Component<ViewProps> {

  readonly bundle: i18n

  constructor(props: ViewProps) {
    super(props)
    this.bundle = app.getBundle()
  }

  render() {
    const b = this.bundle.routes.visualizzaSpedizione

    return <div>VisualizzaSpedizione</div>
  }
}