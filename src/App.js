// @flow

// $FlowFixMe
import Expo from 'expo'
import React, { PureComponent } from 'react'
import { Provider as StoreProvider } from 'react-redux'
import EStyleSheet from 'react-native-extended-stylesheet'
import createStore from './store'
import NavigationScreen from './navigation/NavigationScreen'
import style from './style'
import I18n, { Provider as I18nProvider } from './I18n'

EStyleSheet.build(style)

type State = { isReady: boolean }

const store = createStore()
const i18n = new I18n()

export default class App extends PureComponent<void, State> {

  state: State

  constructor() {
    super()
    this.state = {
      isReady: false,
    }
  }

  async componentWillMount() {
    i18n.setLocale('fr')
    const loadFont = Expo.Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    })
    const loadLocale = Expo.Util.getCurrentLocaleAsync().then((locale) => {
      i18n.setLocale(locale)
    })
    await Promise.all([loadFont, loadLocale])
    this.setState({ isReady: true })
  }

  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />
    }
    return (
      <StoreProvider store={store}>
        <I18nProvider i18n={i18n}>
          <NavigationScreen />
        </I18nProvider>
      </StoreProvider>
    )
  }
}
