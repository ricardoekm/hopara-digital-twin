import {mapActions, mapState} from '../DeckViewContainer'
import {GeoViewComponent} from './GeoViewComponent'
import {connect} from '@hopara/state'

export default connect(mapState, mapActions)(GeoViewComponent)
