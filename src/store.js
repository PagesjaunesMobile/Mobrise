// @flow

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { middleware as pack } from 'redux-pack'
import { multiActionsMiddleware as multiActions, injectMiddleware as inject } from './utils'
import navigation from './navigation/navigationReducer'
import connection from './connection/connectionReducer'
import dashboard from './dashboard/dashboardReducer'
import BitriseClient from './services/BitriseClient'


const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // eslint-disable-line no-underscore-dangle

// $FlowFixMe
const store = createStore(combineReducers({
  navigation,
  connection,
  dashboard,
}), composeEnhancers(applyMiddleware(
  multiActions,
  inject({ bitrise: new BitriseClient(), dispatch: (action: any) => store.dispatch(action), getState: () => store.getState() }),
  pack,
)))

export default store
