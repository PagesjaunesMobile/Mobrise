// @flow

import React, { PureComponent } from 'react'
import { Platform, FlatList } from 'react-native'
import { ListItem, Text, Spinner, View, Body, Left, Right, Icon } from 'native-base'
import EStyleSheet from 'react-native-extended-stylesheet'
import autobind from 'autobind-decorator'
import BuildStatusBadge from './BuildStatusBadge'
import BuildBranchBadge from './BuildBranchBadge'
import BuildWorkflowBadge from './BuildWorkflowBadge'
import { reduxify } from '../utils'
import { openBuild, refreshApp, loadMoreBuilds } from './dashboardReducer'
import type { Build } from '../services/BitriseClient'


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
  listItemBodyBadge: {
    marginRight: 5,
  },
  listItemBody: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  listItemCommitText: {
    flex: 1,
  },
  loadingMoreContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
})

type Props = {
  loading: boolean,
  builds: Array<Build>,
  openBuild: (Build) => void,
  refreshApp: () => void,
  loadMoreBuilds: () => void,
  hasMore: boolean,
  loadingMore: boolean,
}
@reduxify(state => ({
  loading: state.dashboard.loading,
  builds: state.dashboard.builds,
  hasMore: state.dashboard.hasMore,
  loadingMore: state.dashboard.loadingMore,
}), {
  openBuild,
  refreshApp,
  loadMoreBuilds,
})
export default class BuildList extends PureComponent<Props, void> {

  static navigationOptions = ({ navigation }: { navigation: any }) => ({
    title: navigation.state.params.title,
  });

  render() {
    return (
      <View style={style.container}>
        <FlatList
          data={this.props.builds}
          keyExtractor={build => build.slug}
          refreshing={this.props.loading}
          refreshControl={<Spinner color={EStyleSheet.flatten(style.spinner).color} />}
          onRefresh={this.props.refreshApp}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.8}
          renderItem={({ item: build } : { item: Build }) => ( // eslint-disable-line react/no-unused-prop-types
            <ListItem icon onPress={() => { this.props.openBuild(build) }} style={{ backgroundColor: 'transparent' }}>
              <Left>
                <BuildStatusBadge build={build} />
              </Left>
              <Body style={style.listItemBody}>
                <BuildBranchBadge style={style.listItemBodyBadge} build={build} />
                <BuildWorkflowBadge style={style.listItemBodyBadge} build={build} />
                <Text numberOfLines={1} style={style.listItemCommitText}>{build.commit_message}</Text>
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
      this.props.loadMoreBuilds()
    }
  }

}
