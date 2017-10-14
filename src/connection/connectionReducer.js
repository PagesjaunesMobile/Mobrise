// @flow

import type BitriseClient, { Account } from '../services/BitriseClient'
import { navigateToApps } from '../navigation/navigationReducer'

type State = (typeof initialState)
const initialState = {
  connected: false,
  connecting: false,
  token: '',
  username: '',
}

const CONNECT = 'CONNECT'
export const DISCONNECT = 'DISCONNECT'
const CONNECT_SUCCESS = 'CONNECT_SUCCESS'
const CONNECT_FAIL = 'CONNECT_FAIL'

export const connect = (token: string) => async (dispatch:(any) => void, getState:() => State, { bitrise } : { bitrise: BitriseClient }) => {
  dispatch({ type: CONNECT })
  bitrise.setToken(token)
  const account = await bitrise.account()
  dispatch({
    type: CONNECT_SUCCESS,
    account,
    token,
  })
  dispatch(navigateToApps())
}

export const disconnect = () => ({
  type: DISCONNECT,
})

export default (state: State = initialState, action: { type: string, token: ?string, account: ?Account }) => {
  switch (action.type) {
    case CONNECT:
      return {
        ...state,
        connecting: true,
      }
    case DISCONNECT:
      return initialState
    case CONNECT_SUCCESS:
      return {
        ...state,
        connected: true,
        connecting: false,
        token: action.token,
        username: action.account ? action.account.username : '',
      }
    case CONNECT_FAIL:
      return {
        ...state,
        connected: false,
        connecting: false,
        username: '',
      }
    default:
      return state
  }
}
