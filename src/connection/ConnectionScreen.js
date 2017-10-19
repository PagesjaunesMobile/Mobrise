// @flow

import React, { PureComponent } from 'react'
import { Image, TouchableOpacity } from 'react-native'
import { View, Item, Icon, Input, Button, Text } from 'native-base'
import EStyleSheet from 'react-native-extended-stylesheet'
import autobind from 'autobind-decorator'
import { reduxify } from '../utils'
import { connect, disconnect } from './connectionReducer'

const style = EStyleSheet.create({
  container: {
    backgroundColor: '$green',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 50,
  },
  bannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    height: 100,
  },
  banner: {
    flexShrink : 1,
    resizeMode: 'contain',
    maxHeight: 100,
  },
  tokenContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor:'red',
    minHeight:50,
  },
  tokenItem: {
    backgroundColor: '$lightGrey',
    marginLeft: 10,
    marginRight: 10,
  },
  tokenIcon: {
    color: '$purple',
    backgroundColor: 'transparent',
  },
  tokenIconContainer: {
    height:40,
    width:40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  tokenInput: {
    color: '$darkGrey',
  },
  connectContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 100,
  },
  connectButton: {
    backgroundColor: '$purple',
    alignSelf: 'center',
  },
  bottomSpacer: {
    flex: 2,
  },
})

type Props = {
  connect: (string) => void,
  token: string,
}
type State = {
  token: string,
}
@reduxify(state => ({
  token: state.connection.token,
}), {
  connect,
  disconnect,
})
export default class ConnectionScreen extends PureComponent<Props, State> {

  static navigationOptions = {
    header: null,
    headerBackTitle: 'Back',
  }

  state: State

  constructor(props: Props) {
    super(props)
    this.state = {
      token: this.props.token,
    }
  }

  render() {
    return (
      <View style={style.container}>
        <View style={style.bannerContainer}>
          <Image source={require('../assets/banner.png')} style={style.banner} />
        </View>
        <View style={style.tokenContainer}>
          <Item rounded style={style.tokenItem}>
            <Icon name="key" style={style.tokenIcon} />
            <Input
              placeholder="Token"
              value={this.state.token}
              onChangeText={(text => this.setState({ token: text }))}
              style={style.tokenInput}
            />
            <TouchableOpacity style={style.tokenIconContainer} onPress={() => this.setState({ token: '' })}>
              <Icon name="close" style={style.tokenIcon} />
            </TouchableOpacity>
          </Item>
        </View>

        <View style={style.connectContainer}>
          <Button
            rounded
            style={style.connectButton}
            onPress={this.connect}
          >
            <Text>Connect</Text>
            <Icon name="arrow-forward" />
          </Button>
        </View>
        <View style={style.bottomSpacer} />
      </View>
    )
  }

  @autobind
  connect() {
    this.props.connect(this.state.token)
  }
}
