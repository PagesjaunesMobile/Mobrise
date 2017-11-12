// @flow
import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import Polyglot from 'node-polyglot'

const locales = {
  fr: () => require('./assets/locales/fr.json'),
  en: () => require('./assets/locales/en.json'),
}

export default class I18n {

  polyglot: Polyglot = new Polyglot()
  locale: string

  setLocale(locale: string) {
    [locale] = locale.replace(/_/g, '-').split('-')
    this.locale = (locale in locales) ? locale : 'en'
    this.polyglot.extend(locales[this.locale]())
  }

  t(key: string) {
    return this.polyglot.t(key)
  }
}

type ProviderProps = {
  i18n: I18n,
  children: any
}

export class Provider extends Component<ProviderProps> {
  props: ProviderProps


  static childContextTypes = {
    i18n: PropTypes.object.isRequired,
  }

  getChildContext() {
    return { i18n : this.props.i18n }
  }

  render() {
    return Children.only(this.props.children)
  }
}

export const connect = (prefix: string) => (WrappedComponent: any) => {
  return class I18nComponent extends Component<void> { // eslint-disable-line react/no-multi-comp
    // let’s define what’s needed from the `context`
    static contextTypes = {
      i18n: PropTypes.object.isRequired,
    }
    render() {
      const { i18n } = this.context
      const t = (key: string) => {
        if (prefix && !key.startsWith('common')) {
          key = `${prefix}.${key}`
        }
        return i18n.t(key)
      }
      return (
        <WrappedComponent {...this.props} t={t} />
      )
    }
  }
}
