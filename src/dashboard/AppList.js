// @flow

import React, { Component } from 'react'
import { Platform, FlatList } from 'react-native'
import { ListItem, Text, Spinner, View, Body, Right, Left, Icon } from 'native-base'
import EStyleSheet from 'react-native-extended-stylesheet'
import { reduxify } from '../utils'
import { openApp, refreshApps, loadMoreApps } from './dashboardReducer'
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
  openApp: (App) => void,
  refreshApps: () => void,
  loadMoreApps: () => void,
  hasMore: boolean,
}
@reduxify(state => ({
  loading: state.dashboard.loading,
  apps: state.dashboard.apps,
  hasMore: state.dashboard.hasMore,
}), {
  openApp,
  refreshApps,
  loadMoreApps,
})
export default class AppList extends Component<Props, void> {

  static navigationOptions = {
    title: 'Apps',
  }

  render() {
    return (
      <View style={style.container}>
        <FlatList
          data={this.props.apps}
          keyExtractor={app => app.slug}
          refreshControl={this.props.loading ? <Spinner color={EStyleSheet.flatten(style.spinner).color} /> : null}
          refreshing={this.props.loading}
          onRefresh={this.props.refreshApps}
          onEndReached={() => { if (this.props.hasMore) this.props.loadMoreApps() }}
          onEndReachedThreshold={10}
          renderItem={({ item: app }: { item: App }) => ( // eslint-disable-line react/no-unused-prop-types
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
