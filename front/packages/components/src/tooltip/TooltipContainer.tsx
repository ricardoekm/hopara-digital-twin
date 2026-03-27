import {useMemo} from 'react'
import {Store} from '../state/Store'
import TooltipComponent, {StateProps} from './TooltipComponent'
import {getLines} from './domain/TooltipLineFactory'
import {connect} from '@hopara/state'

function mapState(state: Store): StateProps {
  const layers = state.layerStore.layers
  const tooltip = state.tooltip!
  const layer = layers.getById(tooltip.layerId)
  const query = state.queryStore.queries.findQuery(layer?.getQueryKey())
  const columns = query?.getColumns()
  const tenant = state.auth.authorization.tenant

   
  const lines = useMemo(() => {
    return getLines(tooltip.row, tenant, columns, layer?.details)
  }, [tooltip.row?._id ?? tooltip.row, tooltip])

  return {
    tooltip,
    lines,
  }
}

export default connect(mapState, undefined, (store) => {
  return !!store.tooltip
})(TooltipComponent)
