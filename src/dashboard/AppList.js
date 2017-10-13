// @flow

import React, { Component } from 'react'
import { Platform } from 'react-native'
import { List, ListItem, Text, Spinner, View, Body, Right, Left, Icon } from 'native-base'
import EStyleSheet from 'react-native-extended-stylesheet'
import { reduxify } from '../utils'
import { getApps, openApp } from './dashboardReducer'
import type { App } from '../services/BitriseClient'

const style = EStyleSheet.create({
  container: {
    backgroundColor: '$lightGrey',
    flex: 1,
  },
  spinner: {
    color: '$purple',
  },
  listItem: {
    backgroundColor: 'transparent',
  },
})

type Props = {
  loading: boolean,
  apps: Array<App>,
  getApps(): () => void,
  openApp(): (App) => void,
}
@reduxify(state => ({
  loading: state.dashboard.loading,
  apps: state.dashboard.apps,
}), {
  getApps,
  openApp,
})
export default class AppList extends Component<Props, void> {

  static navigationOptions = {
    title: 'Apps',
  }

  componentDidMount() {
    if (!this.props.apps) {
      this.props.getApps()
    }
  }

  render() {
    return (
      <View style={style.container}>
        {
          this.props.loading &&
          <Spinner color={EStyleSheet.flatten(style.spinner).color} />
        }
        <List
          dataArray={this.props.apps || []}
          renderRow={(app: App) => (
            <ListItem disabled={app.is_disabled} icon onPress={() => { this.props.openApp(app) }} style={style.listItem}>
              <Left>
                <Icon
                  name={app.project_type === 'ios' ? 'logo-apple' : 'logo-android'}
                  style={{ color: app.project_type === 'ios' ? '#999999' : '#a4c639' }}
                />
              </Left>
              <Body>
                <Text>{app.title}</Text>
              </Body>
              { Platform.OS === 'ios' &&
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              }
            </ListItem>
          )}
        />
      </View>
    )
  }

}
