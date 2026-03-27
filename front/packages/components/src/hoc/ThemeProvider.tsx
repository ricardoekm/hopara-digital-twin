import {connect} from 'react-redux'
import {Store} from '../state/Store'
import {ThemeProvider} from '@hopara/design-system/src/ThemeProvider'

export default connect(
  (store: Store) => ({authorization: store.auth.authorization, themeConfig: store.theme}))(ThemeProvider)
