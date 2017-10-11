import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

export default { reduxify }

export const reduxify = (matchPropsToState, actions) => {
  const provideDispatch = dispatch => bindActionCreators(actions, dispatch)
  const matchDispatchToProps = actions ? provideDispatch : null
  return connect(matchPropsToState, matchDispatchToProps)
}
