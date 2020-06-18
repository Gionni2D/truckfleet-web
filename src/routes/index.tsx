import * as React from 'react'
import HomePresenter from './Home/HomePresenter'
import app from '../app'

export enum RouteList {
  Default,
  Home
}

type RoutesWithoutData =
  RouteList.Default |
  RouteList.Home

interface BaseRouteData { route: RoutesWithoutData }

export type RouteData =
  BaseRouteData

export default class Router
  extends React.Component<{}, { data: RouteData }> {

  constructor(props={}) {
    super(props);
    this.state = {
      data: {
        route: RouteList.Default
      }
    }
  }

  componentDidMount() {
    app.subscribe(this.onAppStateUpdate)
    app.changeRoute(this.state.data);
  }

  onAppStateUpdate = () => {
    const { routeData } = app.getState()
    this.setState({ data: routeData })
  }

  render() {
    const { data } = this.state
    switch(data.route) {
      case RouteList.Default:
      case RouteList.Home:
        return <HomePresenter />
      default:
        return <div>No case</div>
    }
  }
}