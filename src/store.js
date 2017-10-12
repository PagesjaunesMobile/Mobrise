// @flow

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import { AsyncStorage } from 'react-native'
import thunk from 'redux-thunk'
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
}), composeEnhancers(applyMiddleware(thunk.withExtraArgument({ bitrise: new BitriseClient() }))), autoRehydrate())

export const persistor = persistStore(store, { storage: AsyncStorage, whitelist: ['connection'] })

export default store
