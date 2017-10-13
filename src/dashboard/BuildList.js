// @flow

import React, { Component } from 'react'
import { Platform } from 'react-native'
import { List, ListItem, Text, Spinner, View, Body, Left, Right, Icon } from 'native-base'
import EStyleSheet from 'react-native-extended-stylesheet'
import BuildStatusBadge from './BuildStatusBadge'
import BuildBranchBadge from './BuildBranchBadge'
import { reduxify } from '../utils'
import { openBuild } from './dashboardReducer'
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
}
@reduxify(state => ({
  loading: state.dashboard.loading,
  builds: state.dashboard.builds,
}), {
  openBuild,
})
export default class BuildList extends Component<Props, void> {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  });

  render() {
    return (
      <View style={style.container}>
        {
          this.props.loading &&
          <Spinner color={EStyleSheet.flatten(style.spinner).color} />
        }
        <List
          dataArray={this.props.builds || []}
          renderRow={(build: Build) => (
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
