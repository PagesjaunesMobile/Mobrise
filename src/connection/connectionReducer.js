// @flow

import { SecureStore } from 'expo'
import type BitriseClient from '../services/BitriseClient'
import { openApps } from '../dashboard/dashboardReducer'
import { createAction, actionHandler } from '../utils'

const initialState = {
  connecting: false,
  token: '',
  username: '',
}
export type State = (typeof initialState)


const CONNECT = createAction('CONNECT')
const LOAD_TOKEN = createAction('LOAD_TOKEN')
const CLEAR_TOKEN = createAction('CLEAR_TOKEN')

export const connect = (token: string) => ({ bitrise, dispatch } : { bitrise: BitriseClient, dispatch: any }) => {
  bitrise.setToken(token)
  return CONNECT.createAsync(bitrise.account().then(account => ({ account, token })), {
    onSuccess: () => {
      dispatch(openApps())
      SecureStore.setItemAsync('TOKEN', token)
    },
  })
}

export const loadToken = () => LOAD_TOKEN.createAsync(SecureStore.getItemAsync('TOKEN'))
export const clearToken = () => CLEAR_TOKEN.createAsync(SecureStore.deleteItemAsync('TOKEN'))

export default (state: State = initialState, action: any) => {
  const { payload } = action
  return actionHandler(state, action)
    .handleAsync(CONNECT, {
      start: state => ({ ...state, connecting: true }),
      success: state => ({ ...state, username: payload.account.data.username }),
      finish: state => ({ ...state, connecting: false }),
    })
    .handleAsync(LOAD_TOKEN, {
      success: state => ({ ...state, token: payload }),
    })
    .handleAsync(CLEAR_TOKEN, {
      success: state => ({ ...state, token: '' }),
    })
    .getState()
}
