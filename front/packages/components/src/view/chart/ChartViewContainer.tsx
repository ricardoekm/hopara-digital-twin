import {mapActions, mapState} from '../DeckViewContainer'
import {ChartViewComponent} from './ChartViewComponent'
import {connect} from '@hopara/state'

export default connect(mapState, mapActions)(ChartViewComponent)
