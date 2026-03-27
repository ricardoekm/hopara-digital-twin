import { mapActions, mapState } from '../DeckViewContainer'
import { ThreeDViewComponent } from './3DViewComponent'
import {connect} from '@hopara/state'

export default connect(mapState, mapActions)(ThreeDViewComponent)
