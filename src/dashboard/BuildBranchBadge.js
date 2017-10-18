// @flow

import React from 'react'
import { Badge, Text } from 'native-base'
import type { Build } from '../services/BitriseClient'

const BuildBranchBadge = ({ build, style }: { build: Build, style?: any}) => (
  <Badge
    style={{ ...style, marginRight: 10, alignSelf: null }}
    info={build.pull_request_id === 0}
    warning={build.pull_request_id !== 0}
  >
    <Text numberOfLines={1} >{`${build.branch || ''}${build.pull_request_id ? `#${build.pull_request_id}` : ''}`}</Text>
  </Badge>
)

BuildBranchBadge.defaultProps = {
  style: null,
}

export default BuildBranchBadge
