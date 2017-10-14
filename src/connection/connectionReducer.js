// @flow

import type BitriseClient from '../services/BitriseClient'
import { openApps } from '../dashboard/dashboardReducer'
import { createAction, actionHandler } from '../utils'

type State = (typeof initialState)
const initialState = {
  connected: false,
  connecting: false,
  token: '',
  username: '',
}

const CONNECT = createAction('CONNECT')
export const DISCONNECT = createAction('DISCONNECT')

export const connect = (token: string) => ({ bitrise, dispatch } : { bitrise: BitriseClient, dispatch: any }) => {
  bitrise.setToken(token)
  return CONNECT.createAsync(
    bitrise.account().then(account => ({ account, token })),
    { onSuccess: () => { dispatch(openApps()) } },
  )
}

export const disconnect = () => DISCONNECT.create()

export default (state: State = initialState, action: any) => {
  const { token, account } = action.payload || {}
  return actionHandler(state, action)
    .handleAsync(CONNECT, {
      start: state => ({ ...state, connecting: true }),
      success: state => ({ ...state, connected: true, token, username: account.username }),
      failure: state => ({ ...state, connected: false }),
      finish: state => ({ ...state, connecting: false }),
    })
    .handle(DISCONNECT, initialState)
    .getState()
}
