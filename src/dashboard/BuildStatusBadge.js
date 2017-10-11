// @flow

import React, { Component } from 'react'
import { Badge, Text } from 'native-base'
import type { Build } from '../services/BitriseClient'

type Props = {
  build: Build,
  style?: any,
}

export default class BuildStatusBadge extends Component<Props, void> {

  render() {
    const { build, style } = this.props
    return (
      <Badge
        style={{ ...style, alignSelf: null }}
        primary={build.status === 0}
        success={build.status === 1}
        danger={build.status === 2}
        warning={build.status === 3}
      >
        <Text>{build.build_number}</Text>
      </Badge>
    )
  }
}
