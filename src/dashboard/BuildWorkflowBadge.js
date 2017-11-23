// @flow

import React from 'react'
import { Badge, Text } from 'native-base'
import EStyleSheet from 'react-native-extended-stylesheet'
import type { Build } from '../services/BitriseClient'

const style = EStyleSheet.create({
  badge: {
    alignSelf: null,
    backgroundColor: '$green',
  },
})

const BuildWorkflowBadge = (props: { build: Build, style?: any}) => (
  <Badge
    style={EStyleSheet.flatten([style.badge, props.style])}
  >
    <Text numberOfLines={1} >{props.build.triggered_workflow}</Text>
  </Badge>
)

BuildWorkflowBadge.defaultProps = {
  style: {},
}

export default BuildWorkflowBadge
