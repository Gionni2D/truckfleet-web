import { i18n } from '../../i18n'
import * as React from 'react'
import app from '../../app'

interface ViewProps {
}

export default class GestioneSpedizioniView
  extends React.Component<ViewProps> {

  readonly bundle: i18n

  constructor(props: ViewProps) {
    super(props)
    this.bundle = app.getBundle()
  }

  render() {
    const b = this.bundle.routes.gestioneSpedizioni

    return <div>GestioneSpedizioni</div>
  }
}