// @flow

import React, { Component } from 'react'
import { Animated } from 'react-native'
import { View, Form, Item, Label, Input, Button, Text } from 'native-base'
import EStyleSheet from 'react-native-extended-stylesheet'
import autobind from 'autobind-decorator'
import { DangerZone } from 'expo'
import { reduxify } from '../utils'
import { connect, disconnect } from './connectionReducer'

const { Lottie } = DangerZone

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

  static navigationOptions = {
    title: 'Mobrise',
    headerBackTitle: 'Home',
  }

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
        <Form style={{ marginTop: 10 }}>
          <Item fixedLabel>
            <Label>Access token</Label>
            <Input
              value={this.state.token}
              onChangeText={(text => this.setState({ token: text }))}
            />
          </Item>
        </Form>
        <Button
          full
          style={style.connectButton}
          onPress={this.onConnect}
        >
          <Text>Connect</Text>
        </Button>
        <View style={{ flex: 1, alignItems:'center' }}>
          <View style={{ height: 300, width: 300 }}>
            <Lottie
              style={{ height: 300, width: 300 }}
              source={require('../resources/animations/gears.json')} // eslint-disable-line global-require
              progress={this.state.loading}
            />
          </View>
        </View>
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
