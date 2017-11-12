// @flow

import React from 'react'
import { Icon } from 'native-base'
import { Image } from 'react-native'

import type { App } from '../services/BitriseClient'

const logos = {
  'react-native': require('../assets/images/react-native.png'),
  xamarin: require('../assets/images/xamarin.png'),
  fastlane: require('../assets/images/fastlane.png'),
  ionic: require('../assets/images/ionic.png'),
  cordova: require('../assets/images/cordova.png'),
  other: require('../assets/images/unknown.png'),
}

export default ({ app } : { app: App}) => {
  if (['ios', 'android', 'macos'].includes(app.project_type)) {
    return (
      <Icon
        name={app.project_type === 'android' ? 'logo-android' : 'logo-apple'}
        style={{ color: app.project_type === 'android' ? '#a4c639' : '#999999' }}
      />
    )
  }
  return (
    <Image style={{ width: 20, height: 20 }} source={logos[app.project_type]} />
  )
}
