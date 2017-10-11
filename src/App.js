// @flow

import Expo from 'expo'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import store, { persistor } from './store'
import NavigatorScreen from './navigation/NavigationScreen'

type State = { isReady: boolean }

export default class App extends Component<void, State> {

  state: State

  constructor() {
    super()
    this.state = {
      isReady: false,
    }
  }

  componentWillMount() {
    Expo.Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'), // eslint-disable-line global-require
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'), // eslint-disable-line global-require
    }).then(() => {
      this.setState({ isReady: true })
    })
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />
    }
    return (
      <Provider store={store} persistor={persistor}>
        <NavigatorScreen />
      </Provider>
    )
  }
}
