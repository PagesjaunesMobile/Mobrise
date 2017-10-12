// @flow

import React, { Component } from 'react'
import { Animated, Image } from 'react-native'
import { View, Item, Icon, Input, Button, Text } from 'native-base'
import EStyleSheet from 'react-native-extended-stylesheet'
import autobind from 'autobind-decorator'
import { reduxify } from '../utils'
import { connect, disconnect } from './connectionReducer'
import defaultStyle from '../style'

const style = EStyleSheet.create({
  connectButton: {
    backgroundColor: '$purple',
    marginTop: 30,
    marginBottom: 30,
  },
})

type Props = {
  connecting: boolean,
  connected: boolean,
  connect: (string) => void,
  disconnect: () => void,
  token: string,
}

type State = {
  loading: any,
  token: string,
}

@reduxify(state => ({
  connecting: state.connection.connecting,
  token: state.connection.token,
}), {
  connect,
  disconnect,
})
export default class ConnectionScreen extends Component<Props, State> {

  static navigationOptions = ({ navigationOptions }) => ({
    title: 'Mobrise',
    headerBackTitle: 'Home',
    headerStyle: {
      ...navigationOptions.headerStyle,
      backgroundColor: defaultStyle.$purple,
    },
    headerTitleStyle: {
      alignSelf: 'center',
      textAlign: 'center',
    },
    headerLeft: (<Image source={require('../assets/logo.png')} style={{ width: 40, height: 40, marginLeft:10 }} />), // eslint-disable-line global-require
    headerRight: (<View />),
  })

  state: State

  constructor(props: Props) {
    super(props)
    this.state = {
      loading: new Animated.Value(0),
      token: props.token,
    }
  }

  render() {
    if (this.props.connecting) {
      this.loading()
    }
    return (
      <View>
        <Item>
          <Icon name="key" />
          <Input
            placeholder="Token"
            value={this.state.token}
            onChangeText={(text => this.setState({ token: text }))}
          />
        </Item>
        <Button
          rounded
          style={style.connectButton}
          onPress={this.onConnect}
        >
          <Icon name="arrow-forward" />
        </Button>
      </View>
    )
  }

  loading() {
    Animated.timing(this.state.loading, {
      toValue: 1,
      duration: 1000,
    }).start()
  }

  @autobind
  onConnect() {
    if (this.props.connected) {
      this.props.disconnect()
    } else {
      this.props.connect(this.state.token)
    }
  }
}
