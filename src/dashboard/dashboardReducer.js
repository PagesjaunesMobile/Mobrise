// @flow

import type BitriseClient, { Build, App, Paging } from '../services/BitriseClient'
import { DISCONNECT } from '../connection/connectionReducer'
import { navigateToApps, navigateToApp, navigateToBuild } from '../navigation/navigationReducer'
import { createAction, actionHandler } from '../utils'

const GET_APPS = createAction('GET_APPS')
const GET_APP = createAction('GET_APP')
const SET_BUILD = createAction('SET_BUILD')
const CLEAR_APPS = createAction('CLEAR_APPS')
const CLEAR_APP = createAction('CLEAR_APP')
const LOAD_MORE_APPS = createAction('LOAD_MORE_APPS')
const LOAD_MORE_BUILDS = createAction('LOAD_MORE_BUILDS')

type State = {
  loading: boolean,
  apps: ?Array<App>,
  appsPaging: ?Paging,
  app: ?App,
  builds: ?Array<Build>,
  buildsPaging: ?Paging,
  build: ?Build,
  hasMore: boolean,
}

const initalState: State = {
  loading: false,
  apps: null,
  builds: null,
  build: null,
  app: null,
  appsPaging: null,
  buildsPaging: null,
  hasMore: false,
}

const getApps = () => ({ bitrise } : { bitrise : BitriseClient }) => (
  GET_APPS.createAsync(bitrise.apps())
)
export const openApps = () => ([
  navigateToApps(),
  CLEAR_APPS.create(),
  getApps(),
])
export const refreshApps = getApps
export const loadMoreApps = () => ({ bitrise, getState } : { bitrise : BitriseClient, getState: () => any }) => {
  const { dashboard } = getState()
  if (dashboard.hasMore) {
    return LOAD_MORE_APPS.createAsync(bitrise.apps(dashboard.appsPaging.next))
  }
  return null
}

const getApp = (app: App) => ({ bitrise } : { bitrise : BitriseClient }) => (
  GET_APP.createAsync(bitrise.builds(app.slug).then(response => ({ response, app })))
)
export const openApp = (app: App) => ([
  navigateToApp(app),
  CLEAR_APP.create(),
  getApp(app),
])
export const refreshApp = () => ({ getState }: { getState: () => any }) => (
  getApp(getState().dashboard.app)
)
export const loadMoreBuilds = () => ({ bitrise, getState } : { bitrise : BitriseClient, getState: () => any }) => {
  const { dashboard } = getState()
  if (dashboard.hasMore) {
    console.log(JSON.stringify(dashboard.buildsPaging))
    return LOAD_MORE_BUILDS.createAsync(bitrise.builds(dashboard.app.slug, dashboard.buildsPaging.next).then((response) => {
      console.log(JSON.stringify(response))
      return response
    }))
  }
  return null
}

export const openBuild = (build: Build) => ([
  navigateToBuild(build),
  SET_BUILD.create(build),
])

export default (state: State = initalState, action: any) => {
  return actionHandler(state, action)
    .handle(CLEAR_APPS, { ...state, apps: null, app: null, builds: null, build: null, appsPaging: null, buildsPaging: null })
    .handleAsync(GET_APPS, {
      start: (state: State) => ({ ...state, loading: true }),
      success: (state: State) => ({ ...state, apps: action.payload.data, appsPaging: action.payload.paging, hasMore: !!action.payload.paging.next }),
      finish: (state: State) => ({ ...state, loading: false }),
    })
    .handleAsync(LOAD_MORE_APPS, {
      start: (state: State) => ({ ...state, loading: true, hasMore: false }),
      success: (state: State) => ({ ...state, apps: [...state.apps || [], ...action.payload.data || []], appsPaging: action.payload.paging, hasMore: !!action.payload.paging.next }),
      finish: (state: State) => ({ ...state, loading: false }),
      failure: (state: State) => ({ ...state, hasMore: true }),
    })
    .handle(CLEAR_APP, { ...state, app: null, builds: null, build: null, buildsPaging: null })
    .handleAsync(GET_APP, {
      start: (state: State) => ({ ...state, loading: true }),
      success: (state: State) => ({ ...state, builds: action.payload.response.data, buildsPaging: action.payload.response.paging, hasMore: !!action.payload.response.paging.next, app: action.payload.app }),
      finish: (state: State) => ({ ...state, loading: false }),
    })
    .handleAsync(LOAD_MORE_BUILDS, {
      start: (state: State) => ({ ...state, loading: true, hasMore: false }),
      success: (state: State) => ({ ...state, builds: [...state.builds || [], ...action.payload.data || []], buildsPaging: action.payload.paging, hasMore: !!action.payload.paging.next }),
      finish: (state: State) => ({ ...state, loading: false }),
      failure: (state: State) => ({ ...state, hasMore: true }),
    })
    .handle(SET_BUILD, { ...state, build: action.payload })
    .handle(DISCONNECT, initalState)
    .getState()
}
