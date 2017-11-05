// @flow
import React, { Component, PropTypes, Children } from 'react'
import Polyglot from 'node-polyglot'

const locales = {
  fr: () => require('./assets/locales/fr.json'),
  en: () => require('./assets/locales/en.json'),
}

export default class I18n {

  polyglot = new Polyglot()

  setLocale(locale: string) {
    [locale] = locale.replace(/_/g, '-').split('-')
    const traductionProdiver = (locale in locales) ? locales[locale] : locales.en
    const traduction = traductionProdiver()
    this.polyglot.extend(traduction)
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

export const connect = (component: Component<any>) => {
  return class I18nComponent extends Component<void> { // eslint-disable-line react/no-multi-comp
    // let’s define what’s needed from the `context`
    static contextTypes = {
      i18n: PropTypes.object.isRequired,
    }
    render() {
      const { i18n } = this.context
      return (
        <component {...this.props} i18n={i18n} />
      )
    }
  }
}
