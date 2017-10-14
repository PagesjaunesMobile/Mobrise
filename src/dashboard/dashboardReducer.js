// @flow

import type BitriseClient, { Build, App } from '../services/BitriseClient'
import { DISCONNECT } from '../connection/connectionReducer'
import { navigateToApps, navigateToApp, navigateToBuild } from '../navigation/navigationReducer'
import { createAction, actionHandler } from '../utils'

const GET_APPS = createAction('GET_APPS')
const GET_APP = createAction('GET_APP')
const SET_BUILD = createAction('SET_BUILD')

type State = {
  loading: boolean,
  apps: ?Array<App>,
  builds: ?Array<Build>,
  build: ?Build,
}

const initalState: State = {
  loading: false,
  apps: null,
  builds: null,
  build: null,
}

export const openApps = () => ({ bitrise } : { bitrise : BitriseClient }) => ([
  navigateToApps(),
  GET_APPS.createAsync(bitrise.apps()),
])

export const openApp = (app: App) => ({ bitrise } : { bitrise : BitriseClient, dispatch: any }) => ([
  navigateToApp(app),
  GET_APP.createAsync(bitrise.builds(app.slug)),
])

export const openBuild = (build: Build) => ([
  navigateToBuild(build),
  SET_BUILD.create(build),
])


export default (state: State = initalState, action: any) => {
  return actionHandler(state, action)
    .handleAsync(GET_APPS, {
      start: state => ({ ...state, apps: null, builds: null, build: null, loading: true }),
      success: state => ({ ...state, apps: action.payload }),
      finish: state => ({ ...state, loading: false }),
    })
    .handleAsync(GET_APP, {
      start: state => ({ ...state, builds: null, build: null, loading: true }),
      success: state => ({ ...state, builds: action.payload }),
      finish: state => ({ ...state, loading: false }),
    })
    .handle(SET_BUILD, () => ({ ...state, build: action.payload }))
    .handle(DISCONNECT, initalState)
    .getState()
}
