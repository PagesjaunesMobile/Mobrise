// @flow

import type BitriseClient, { Build, App } from '../services/BitriseClient'
import { DISCONNECT } from '../connection/connectionReducer'
import { navigateToApps, navigateToApp, navigateToBuild } from '../navigation/navigationReducer'
import { createAction, actionHandler } from '../utils'

const GET_APPS = createAction('GET_APPS')
const GET_APP = createAction('GET_APP')
const SET_BUILD = createAction('SET_BUILD')
const CLEAR_APPS = createAction('CLEAR_APPS')
const CLEAR_APP = createAction('CLEAR_APP')

type State = {
  loading: boolean,
  apps: ?Array<App>,
  app: ?App,
  builds: ?Array<Build>,
  build: ?Build,
}

const initalState: State = {
  loading: false,
  apps: null,
  builds: null,
  build: null,
  app: null,
}

const getApps = () => ({ bitrise } : { bitrise : BitriseClient }) => GET_APPS.createAsync(bitrise.apps())
export const openApps = () => ([
  navigateToApps(),
  CLEAR_APPS.create(),
  getApps(),
])
export const refreshApps = getApps

const getApp = (app: App) => ({ bitrise } : { bitrise : BitriseClient }) => GET_APP.createAsync(bitrise.builds(app.slug).then(builds => ({ builds, app })))
export const openApp = (app: App) => ([
  navigateToApp(app),
  CLEAR_APP.create(),
  getApp(app),
])
export const refreshApp = () => ({ getState }: { getState: () => any }) => getApp(getState().dashboard.app)


export const openBuild = (build: Build) => ([
  navigateToBuild(build),
  SET_BUILD.create(build),
])


export default (state: State = initalState, action: any) => {
  return actionHandler(state, action)
    .handle(CLEAR_APPS, { ...state, apps: null, app: null, builds: null, build: null })
    .handleAsync(GET_APPS, {
      start: state => ({ ...state, loading: true }),
      success: state => ({ ...state, apps: action.payload }),
      finish: state => ({ ...state, loading: false }),
    })
    .handle(CLEAR_APP, { ...state, app: null, builds: null, build: null })
    .handleAsync(GET_APP, {
      start: state => ({ ...state, loading: true }),
      success: state => ({ ...state, builds: action.payload.builds, app: action.payload.app }),
      finish: state => ({ ...state, loading: false }),
    })
    .handle(SET_BUILD, { ...state, build: action.payload })
    .handle(DISCONNECT, initalState)
    .getState()
}
