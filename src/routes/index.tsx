import * as React from 'react'
import HomePresenter from './Home/HomePresenter'
import app from '../app'

export enum RouteList {
  Default,
  Home
}

export default class Router
  extends React.Component<{}, { route: RouteList, data: any}> {

  constructor(props={}) {
    super(props);
    this.state = {
      route: RouteList.Default,
      data: null
    }
  }

  componentDidMount() {
    app.subscribe(this.onAppStateUpdate)
    app.changeRoute(this.state.route);
  }

  onAppStateUpdate = () => {
    const { route, routeData: data } = app.getState()
    this.setState({ route, data })
  }

  render() {
    const { route, data } = this.state
    switch(route) {
      case RouteList.Default:
      case RouteList.Home:
        return <HomePresenter />
      default:
        return <div>No case</div>
    }
  }
}