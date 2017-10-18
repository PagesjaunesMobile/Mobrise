// @flow

import React, { PureComponent } from 'react'
import { Platform, FlatList } from 'react-native'
import { ListItem, Text, Spinner, View, Body, Right, Left, Icon } from 'native-base'
import EStyleSheet from 'react-native-extended-stylesheet'
import autobind from 'autobind-decorator'
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
  loadingMoreContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
})

type Props = {
  loading: boolean,
  apps: Array<App>,
  openApp: (App) => void,
  refreshApps: () => void,
  loadMoreApps: () => void,
  hasMore: boolean,
  loadingMore: boolean,
}
@reduxify(state => ({
  loading: state.dashboard.loading,
  apps: state.dashboard.apps,
  hasMore: state.dashboard.hasMore,
  loadingMore: state.dashboard.loadingMore,
}), {
  openApp,
  refreshApps,
  loadMoreApps,
})
export default class AppList extends PureComponent<Props, void> {

  static navigationOptions = {
    title: 'Apps',
  }

  render() {
    return (
      <View style={style.container}>
        <FlatList
          data={this.props.apps}
          keyExtractor={app => app.slug}
          refreshControl={<Spinner color={EStyleSheet.flatten(style.spinner).color} />}
          refreshing={this.props.loading}
          onRefresh={this.props.refreshApps}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.8}
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
        {
          this.props.loadingMore &&
          <View style={style.loadingMoreContainer}>
            <Spinner color={EStyleSheet.flatten(style.spinner).color} />
          </View>
        }
      </View>
    )
  }

  @autobind
  onEndReached({ distanceFromEnd } : { distanceFromEnd: number }) { // eslint-disable-line react/no-unused-prop-types
    if (distanceFromEnd > 0 && this.props.hasMore) {
      this.props.loadMoreApps()
    }
  }
}
