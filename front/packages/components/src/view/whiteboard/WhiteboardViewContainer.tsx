import {WhiteboardViewComponent} from './WhiteboardViewComponent'
import { mapActions, mapState } from '../DeckViewContainer'
import {connect} from '@hopara/state'

export default connect(mapState, mapActions)(WhiteboardViewComponent)

