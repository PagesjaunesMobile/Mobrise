// @flow

import { NavigationActions } from 'react-navigation'
import { Navigator } from './NavigationScreen'
import type { App, Build } from '../services/BitriseClient'


export default (state: any, action: any) => {
  return Navigator.router.getStateForAction(action, state) || state
}

export function navigateToConnection() {
  return NavigationActions.navigate({ routeName: 'Connection' })
}

export function navigateToApps() {
  return NavigationActions.navigate({ routeName: 'Apps' })
}

export function navigateToApp(app: App) {
  return NavigationActions.navigate({
    routeName: 'App',
    params: { title: app.title },
  })
}

export function navigateToBuild(build: Build) {
  return NavigationActions.navigate({
    routeName: 'Build',
    params: { title: `Build #${build.build_number}` },
  })
}
