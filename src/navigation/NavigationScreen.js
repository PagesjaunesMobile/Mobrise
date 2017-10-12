// @flow

import React, { Component } from 'react'
import { addNavigationHelpers, StackNavigator, NavigationActions } from 'react-navigation'
import { BackHandler } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import autobind from 'autobind-decorator'
import { reduxify } from '../utils'
import ConnectionScreen from '../connection/ConnectionScreen'
import AppList from '../dashboard/AppList'
import BuildList from '../dashboard/BuildList'
import BuildView from '../dashboard/BuildView'
import style from '../style'

export const Navigator = StackNavigator({
  Connection: {
    screen: ConnectionScreen,
  },
  Apps: {
    screen: AppList,
  },
  Builds: {
    screen: BuildList,
  },
  Build: {
    screen: BuildView,
  },
}, {
  navigationOptions: {
    headerStyle: {
      backgroundColor: style.$green,
    },
    headerTitleStyle: {
      color: 'white',
    },
    headerBackTitleStyle: {
      color: 'white',
    },
    headerTintColor: 'white',
  },
})

type Props = {
  dispatch?: (any) => void,
  navigation?: any,
}

@reduxify(state => ({ navigation: state.navigation }))
export default class NavigationScreen extends Component<Props, void> {

  constructor(props: Props) {
    super(props)
    BackHandler.addEventListener('hardwareBackPress', this.onHardwareBackPress)
  }

  render() {
    return <Navigator navigation={addNavigationHelpers({ dispatch: this.props.dispatch, state: this.props.navigation })} />
  }

  @autobind
  onHardwareBackPress() {
    const { navigation } = this.props
    if (navigation && navigation.index) {
      this.props.dispatch(NavigationActions.back())
      return true
    }
    return false
  }

}
