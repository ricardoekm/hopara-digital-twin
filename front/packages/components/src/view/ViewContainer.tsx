import {Store} from '../state/Store'
import {StateProps, ViewComponent} from './ViewComponent'
import {VisualizationLoadStatus} from '../visualization/VisualizationLoadStatus'
import {VisualizationEditStatus} from '../visualization/VisualizationEditStatus'
import {connect} from '@hopara/state'
import {i18n} from '@hopara/i18n'
import {getMapStyle} from '../map/MapStyleFactory'
import { useMemo } from 'react'
import { EmptyStateType } from './empty-states/CanvasEmptyState'
import { TransformType } from '@hopara/encoding'

const getBlockingError = (state) => {
  if (state.visualizationStore.loadStatus === VisualizationLoadStatus.ERROR) {
    return i18n('ERROR_FETCHING_VISUALIZATION')
  }
}

const getEmptyStateType = (store: Store): EmptyStateType | undefined => {
  const hasRows = useMemo(() => {
    return Object
      .values(store.rowsetStore.rowsets)
      .some((rowset) => rowset.rows && !!rowset.rows.length)
  }, [store.rowsetStore])

  const hasPlacedRows = useMemo(() => {
    return Object
      .values(store.rowsetStore.rowsets)
      .some((rowset) => {
        if (
          rowset.data?.transform?.type === TransformType.place ||
          rowset.positionData?.transform?.type === TransformType.place
        ) {
          return true
        }

        return rowset.rows &&
               rowset.rows.some((row) => row.getCoordinates().isPlaced())
      })
  }, [store.rowsetStore])

  const hasLoadedRowsets = useMemo(() => {
    return store.rowsetStore.hasRowsets() && store.rowsetStore.allLoaded()
  }, [store.rowsetStore])

  if (!store.visualizationStore?.visualization?.hasType()) return

  const hasLayers = store.layerStore.layers && store.layerStore.layers.length > 0
  if (!hasLayers) return EmptyStateType.NO_LAYERS

  if (!hasLoadedRowsets) return
  
  if (!hasRows) {
    return store.visualizationStore.visualization.isChart() ? EmptyStateType.NO_ROWS_CHART : EmptyStateType.NO_ROWS
  } else if (!hasPlacedRows && !store.visualizationStore.visualization.isChart()) {
    return EmptyStateType.NO_ROWS
  }

  return
}

const mapState = (store: Store): StateProps => {
  const mapStyle = getMapStyle(
    store.layerStore.layers,
    store.viewState?.zoom,
    store.objectEditor.mapStyle,
  )

  const emptyStateType = getEmptyStateType(store)

  return {
    authorization: store.auth.authorization,
    fetchProgress: store.fetch.getProgressMean(),
    visualization: store.visualizationStore.visualization,
    visualizationId: store.visualizationStore.visualization?.id,
    area: store.visualizationStore.area,
    appStatus: store.visualizationStore.loadStatus,
    blockingError: getBlockingError(store),
    isDirty: store.visualizationStore.editStatus === VisualizationEditStatus.DIRTY,
    isLoading: (store.rowsetStore.someLoading() && store.rowsetStore.noneFilled()) || !store.visualizationStore.isReady(),
    someRowsetLoading: store.rowsetStore.someLoading(),
    hasAxis: !!store.chart.hasAxis(),
    hasFilters: !!store.filterStore.filters.length,
    hasEditPermissions: store.auth.authorization.canEditVisualization() || store.auth.authorization.canEditRow(),
    mapStyle,
    emptyStateType,
  }
}

export const ViewContainer = connect(mapState)(ViewComponent)
