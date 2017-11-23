// @flow

import type BitriseClient, { Build, App, Paging, BuildLog } from '../services/BitriseClient'
import { navigateToApps, navigateToApp, navigateToBuild } from '../navigation/navigationReducer'
import { createAction, actionHandler } from '../utils'

import type { State as GlobalState } from '../store'

const GET_APPS = createAction('GET_APPS')
const GET_APP = createAction('GET_APP')
const SET_BUILD = createAction('GET_BUILD')
const CLEAR_APPS = createAction('CLEAR_APPS')
const CLEAR_APP = createAction('CLEAR_APP')
const CLEAR_BUILD = createAction('CLEAR_BUILD')
const GET_MORE_APPS = createAction('GET_MORE_APPS')
const GET_MORE_BUILDS = createAction('GET_MORE_BUILDS')
const GET_BUILD_LOG = createAction('GET_BUILD_LOG')

export type State = {
  loading: boolean,
  loadingMore: boolean,
  apps: ?Array<App>,
  appsPaging: ?Paging,
  app: ?App,
  builds: ?Array<Build>,
  buildsPaging: ?Paging,
  build: ?Build,
  buildLog: ?BuildLog,
  hasMore: boolean,
}

const initalState: State = {
  loading: false,
  loadingMore: false,
  apps: null,
  builds: null,
  build: null,
  buildLog: null,
  app: null,
  appsPaging: null,
  buildsPaging: null,
  hasMore: false,
}

const getApps = () => ({ bitrise } : { bitrise : BitriseClient }) => (
  GET_APPS.createAsync(bitrise.getApps())
)
export const openApps = () => ([
  navigateToApps(),
  CLEAR_APPS.create(),
  getApps(),
])
export const refreshApps = getApps
export const loadMoreApps = () => ({ bitrise, getState } : { bitrise : BitriseClient, getState: () => GlobalState }) => {
  const { hasMore, appsPaging } = getState().dashboard
  if (hasMore && appsPaging) {
    return GET_MORE_APPS.createAsync(bitrise.getApps(appsPaging.next))
  }
  return null
}

const getApp = (app: App) => ({ bitrise } : { bitrise : BitriseClient }) => (
  GET_APP.createAsync(bitrise.getBuilds(app.slug).then(response => ({ response, app })))
)
export const openApp = (app: App) => ([
  navigateToApp(app),
  CLEAR_APP.create(),
  getApp(app),
])
export const refreshApp = () => ({ getState }: { getState: () => GlobalState }) => {
  const { app } = getState().dashboard
  if (app) {
    return getApp(app)
  }
  return null
}
export const loadMoreBuilds = () => ({ bitrise, getState } : { bitrise : BitriseClient, getState: () => GlobalState }) => {
  const { hasMore, app, buildsPaging } = getState().dashboard
  if (hasMore && app && buildsPaging) {
    return GET_MORE_BUILDS.createAsync(bitrise.getBuilds(app.slug, buildsPaging.next))
  }
  return null
}

const getBuildLog = () => ({ bitrise, getState } : { bitrise : BitriseClient, getState: () => GlobalState }) => {
  const { build, app } = getState().dashboard
  if (app && build) {
    return GET_BUILD_LOG.createAsync(bitrise.getBuildLog(app.slug, build.slug))
  }
  return null
}

export const openBuild = (build: Build) => ([
  CLEAR_BUILD.create(),
  setBuild(build),
])

export const setBuild = (build: Build) => ({ dispatch }: { dispatch: (any) => void }) => (
  SET_BUILD.createAsync(Promise.resolve(build), {
    onSuccess: () => {
      dispatch(navigateToBuild(build))
      dispatch(getBuildLog())
    },
  })
)

export default (state: State = initalState, action: any) => {
  return actionHandler(state, action)
    .handle(CLEAR_APPS, { ...state, apps: null, app: null, builds: null, build: null, appsPaging: null, buildsPaging: null, buildLog: null })
    .handleAsync(GET_APPS, {
      start: (state: State) => ({ ...state, loading: true }),
      success: (state: State) => ({ ...state, apps: action.payload.data, appsPaging: action.payload.paging, hasMore: !!action.payload.paging.next }),
      finish: (state: State) => ({ ...state, loading: false }),
    })
    .handleAsync(GET_MORE_APPS, {
      start: (state: State) => ({ ...state, loadingMore: true, hasMore: false }),
      success: (state: State) => ({ ...state, apps: [...state.apps || [], ...action.payload.data || []], appsPaging: action.payload.paging, hasMore: !!action.payload.paging.next }),
      finish: (state: State) => ({ ...state, loadingMore: false }),
      failure: (state: State) => ({ ...state, hasMore: true }),
    })
    .handle(CLEAR_APP, { ...state, app: null, builds: null, build: null, buildsPaging: null, buildLog: null })
    .handleAsync(GET_APP, {
      start: (state: State) => ({ ...state, loading: true }),
      success: (state: State) => ({ ...state, builds: action.payload.response.data, buildsPaging: action.payload.response.paging, hasMore: !!action.payload.response.paging.next, app: action.payload.app }),
      finish: (state: State) => ({ ...state, loading: false }),
    })
    .handle(CLEAR_BUILD, { ...state, build: null, buildLog: null })
    .handleAsync(GET_MORE_BUILDS, {
      start: (state: State) => ({ ...state, loadingMore: true, hasMore: false }),
      success: (state: State) => ({ ...state, builds: [...state.builds || [], ...action.payload.data || []], buildsPaging: action.payload.paging, hasMore: !!action.payload.paging.next }),
      finish: (state: State) => ({ ...state, loadingMore: false }),
      failure: (state: State) => ({ ...state, hasMore: true }),
    })
    .handle(SET_BUILD, { ...state, build: action.payload })
    .handleAsync(GET_BUILD_LOG, {
      start: (state: State) => ({ ...state, loading: true }),
      success: (state: State) => ({ ...state, buildLog: action.payload }),
      finish: (state: State) => ({ ...state, loading: false }),
    })
    .getState()
}
