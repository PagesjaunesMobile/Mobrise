// @flow

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handle } from 'redux-pack'

export const reduxify = (matchPropsToState: any, actions: any) => {
  const provideDispatch = dispatch => bindActionCreators(actions, dispatch)
  const matchDispatchToProps = actions ? provideDispatch : null
  return connect(matchPropsToState, matchDispatchToProps)
}

export const multiActionsMiddleware = () => (next: any) => (actions: any) => {
  actions = Array.isArray(actions) ? actions : [actions]
  actions.forEach(next)
}

export const injectMiddleware = (deps: any) => () => (next: any) => (action: any | Function) => {
  while (typeof action === 'function') {
    action = action(deps)
  }
  next(action)
}

export const createAction = (type: string) => ({
  type,
  createAsync: (promise: Promise<any>, meta: any) => ({ type, promise, meta }),
  create: (payload?: any) => ({ type, payload }),
})

export const actionHandler = (state: any, action: { type: string }) => {
  return new ActionHandler(state, action)
}

class ActionHandler {
  state: any
  action: { type: string }
  handled: boolean

  constructor(state: any, action: { type: string }) {
    this.state = state
    this.action = action
    this.handled = false
  }

  handleAsync(action: { type: string }, handlers: { start?: () => any, success?: () => any, failure?: () => any, finish?: () => any, always?: () => any }) {
    return this.handle(action, () => handle(this.state, this.action, handlers))
  }

  handle(action: { type: string }, state: any | () => any) {
    if (!this.handled && this.action.type === action.type) {
      this.state = typeof state === 'function' ? state() : state
      this.handled = true
    }
    return this
  }

  getState() {
    return this.state
  }

}
