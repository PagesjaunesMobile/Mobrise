// @flow

import React, { PureComponent } from 'react'
import { View, ScrollView, Platform } from 'react-native'
import { Card, CardItem, Text, Body, Spinner, Icon } from 'native-base'
import EStyleSheet from 'react-native-extended-stylesheet'
import { reduxify } from '../utils'
import type { Build, BuildLog } from '../services/BitriseClient'
import BuildStatusBadge from './BuildStatusBadge'
import BuildBranchBadge from './BuildBranchBadge'
import BuildWorkflowBadge from './BuildWorkflowBadge'

const style = EStyleSheet.create({
  container: {
    backgroundColor: '$mediumGrey',
    flex: 1,
  },
  badgeContainer: {
    flexDirection: 'row',
  },
  badge: {
    marginRight: 10,
  },
  logText: {
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Courier New',
    fontSize: 10,
  },
})

type Props = {
  build: Build,
  loading: boolean,
  buildLog: BuildLog,
}
@reduxify(state => ({
  build: state.dashboard.build,
  buildLog: state.dashboard.buildLog,
  loading: state.dashboard.loading,
}))
export default class BuildView extends PureComponent<Props, void> {

  static navigationOptions = ({ navigation }: { navigation: any }) => ({ // eslint-disable-line react/no-unused-prop-types
    title: navigation.state.params.title,
  });

  render() {
    const { build } = this.props
    const date = new Date(build.started_on_worker_at)
    const f = (number: number) => number.toString().padStart(2, '0')
    const dateString = `${date.getFullYear()}.${f(date.getMonth())}.${f(date.getDate())} @ ${f(date.getHours())}:${f(date.getMinutes())}`
    let durationString = null
    if (build.finished_at) {
      const endDate = new Date(build.finished_at)
      const duration = endDate.getTime() - date.getTime()
      const durationDate = new Date(duration)
      durationString = `${durationDate.getMinutes()}min ${f(durationDate.getSeconds())}`
    }

    return (
      <View style={style.container}>
        <Card style={{ maxHeight: 100 }}>
          <CardItem style={{ flex:1 }}>
            <Body style={style.badgeContainer}>
              <BuildStatusBadge style={style.badge} build={build} />
              <BuildBranchBadge style={style.badge} build={build} />
              <BuildWorkflowBadge style={style.badge} build={build} />
            </Body>
          </CardItem>
          <CardItem style={{ flex: 1 }}>
            <Body style={{ flexDirection: 'row' }}>
              <Icon name="calendar" style={{ marginRight: 10 }} />
              <Text style={{ marginRight: 10 }}>{dateString}</Text>
              { durationString &&
                <View style={{ flexDirection: 'row' }}>
                  <Icon name="timer" style={{ marginRight: 10 }} />
                  <Text>{durationString}</Text>
                </View>
              }
            </Body>
          </CardItem>
        </Card>
        { build.commit_message &&
          <Card style={{ flex: 0, maxHeight: 300 }}>
            <CardItem>
              <Body>
                <ScrollView>
                  <Text>{build.commit_message}</Text>
                </ScrollView>
              </Body>
            </CardItem>
          </Card>
        }
        { this.props.buildLog &&
          <Card>
            <CardItem>
              <Body>
                <ScrollView>
                  <ScrollView horizontal>
                    <Text style={style.logText}>{this.props.buildLog.text}</Text>
                  </ScrollView>
                </ScrollView>
              </Body>
            </CardItem>
          </Card>
        }
        {
          this.props.loading &&
          <Spinner />
        }
      </View>
    )
  }

}
