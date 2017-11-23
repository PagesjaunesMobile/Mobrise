// @flow

import React from 'react'
import { Badge, Text } from 'native-base'
import EStyleSheet from 'react-native-extended-stylesheet'
import type { Build } from '../services/BitriseClient'

const BuildStatusBadge = ({ build, style }: { build: Build, style?: any }) => (
  <Badge
    style={EStyleSheet.flatten([style, { alignSelf: null }])}
    primary={build.status === 0}
    success={build.status === 1}
    danger={build.status === 2}
    warning={build.status === 3}
  >
    <Text>{build.build_number}</Text>
  </Badge>
)

BuildStatusBadge.defaultProps = {
  style: {},
}

export default BuildStatusBadge
