// @flow

import type BitriseClient, { Build, App } from '../services/BitriseClient'
import { DISCONNECT } from '../connection/connectionReducer'
import { navigateToApp, navigateToBuild } from '../navigation/navigationReducer'

const LOADING_APPS = 'LOADING_APPS'
const LOADING_APP = 'LOADING_APP'
const LOADING_BUILD = 'LOADING_BUILD'
const LOADED = 'LOADED'
const LOADED_APPS = 'LOADED_APPS'
const LOADED_APP = 'LOADED_APP'
const LOADED_BUILD = 'LOADED_BUILD'

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

export const getApps = () => (dispatch:(any) => void, getState:() => State, { bitrise } : { bitrise : BitriseClient }) => {
  dispatch({ type: LOADING_APPS })
  bitrise.apps().then((apps: Array<App>) => {
    dispatch({ type: LOADED_APPS, apps })
  }).catch(() => {
    dispatch({ type: LOADED })
  })
}

export const openApp = (app: App) => (dispatch:(any) => void, getState:() => State, { bitrise } : { bitrise : BitriseClient }) => {
  dispatch(navigateToApp(app))
  dispatch({ type: LOADING_APP })
  bitrise.builds(app.slug).then((builds: Array<Build>) => {
    dispatch({ type: LOADED_APP, builds })
  }).catch(() => {
    dispatch({ type: LOADED })
  })
}

export const openBuild = (build: Build) => (dispatch:(any) => void) => {
  dispatch(navigateToBuild(build))
  dispatch({ type: LOADED_BUILD, build })
}


export default (state: State = initalState, action: { type: string, apps: ?Array<App>, builds: ?Array<Build>, build: ?Build }) => {

  switch (action.type) {
    case LOADING_APPS:
      state = { ...state, apps: null }
    case LOADING_APP:
      state = { ...state, builds: null }
    case LOADING_BUILD:
      return { ...state, build: null, loading: true }

    case LOADED_APPS:
      state = { ...state, apps: action.apps }
    case LOADED_APP:
      state = { ...state, builds: action.builds }
    case LOADED_BUILD:
      state = { ...state, build: action.build }
    case LOADED:
      return { ...state, loading: false }

    case DISCONNECT:
      return initalState

    default:
      return state
  }
}
