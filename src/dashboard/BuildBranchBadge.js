// @flow

import React, { Component } from 'react'
import { Badge, Text } from 'native-base'
import type { Build } from '../services/BitriseClient'

type Props = {
  build: Build,
  style?: any,
}

export default class BuildBranchBadge extends Component<Props, void> {

  render() {
    const { build, style } = this.props
    return (
      <Badge
        style={{ ...style, marginRight: 10, alignSelf: null }}
        info={build.pull_request_id === 0}
        warning={build.pull_request_id !== 0}
      >
        <Text numberOfLines={1} >{`${build.branch || ''}${build.pull_request_id ? `#${build.pull_request_id}` : ''}`}</Text>
      </Badge>
    )
  }
}
