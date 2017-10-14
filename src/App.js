// @flow

// $FlowFixMe
import Expo from 'expo'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import EStyleSheet from 'react-native-extended-stylesheet'
import store, { persistor } from './store'
import NavigationScreen from './navigation/NavigationScreen'
import style from './style'

EStyleSheet.build(style)

type State = { isReady: boolean }

export default class App extends Component<void, State> {

  state: State

  constructor() {
    super()
    this.state = {
      isReady: false,
    }
  }

  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    })
    this.setState({ isReady: true })
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />
    }
    return (
      <Provider store={store} persistor={persistor}>
        <NavigationScreen />
      </Provider>
    )
  }
}
