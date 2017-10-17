// @flow

import React, { Component } from 'react'
import { Platform, FlatList } from 'react-native'
import { ListItem, Text, Spinner, View, Body, Left, Right, Icon } from 'native-base'
import EStyleSheet from 'react-native-extended-stylesheet'
import BuildStatusBadge from './BuildStatusBadge'
import BuildBranchBadge from './BuildBranchBadge'
import { reduxify } from '../utils'
import { openBuild, refreshApp } from './dashboardReducer'
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
})

type Props = {
  loading: boolean,
  builds: Array<Build>,
  openBuild: (Build) => void,
  refreshApp: () => void,
}
@reduxify(state => ({
  loading: state.dashboard.loading,
  builds: state.dashboard.builds,
}), {
  openBuild,
  refreshApp,
})
export default class BuildList extends Component<Props, void> {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  });

  render() {
    return (
      <View style={style.container}>
        <FlatList
          data={this.props.builds}
          keyExtractor={build => build.slug}
          refreshing={this.props.loading}
          refreshControl={this.props.loading ? <Spinner color={EStyleSheet.flatten(style.spinner).color} /> : null}
          onRefresh={this.props.refreshApp}
          renderItem={({ item: build } : { item: Build }) => ( // eslint-disable-line react/no-unused-prop-types
            <ListItem icon onPress={() => { this.props.openBuild(build) }} style={{ backgroundColor: 'transparent' }}>
              <Left>
                <BuildStatusBadge build={build} />
              </Left>
              <Body style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <BuildBranchBadge build={build} />
                <Text numberOfLines={1} style={{ flex: 1 }}>{ build.commit_message}</Text>
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
