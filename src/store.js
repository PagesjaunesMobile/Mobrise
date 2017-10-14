// @flow

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import { AsyncStorage } from 'react-native'
import { middleware as pack } from 'redux-pack'
import inject from 'redux-inject'
import { multiActionsMiddleware as multiActions } from './utils'
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
}), composeEnhancers(
  applyMiddleware(
    inject({ bitrise: new BitriseClient(), dispatch: (action: any) => store.dispatch(action) }),
    multiActions,
    pack,
  ),
  autoRehydrate(),
))

export const persistor = persistStore(store, { storage: AsyncStorage, whitelist: ['connection'] })

export default store
