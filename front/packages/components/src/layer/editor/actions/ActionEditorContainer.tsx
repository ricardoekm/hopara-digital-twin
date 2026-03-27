import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {ActionEditor, ActionProps, StateProps} from '../../../action/editor/ActionEditor'
import {getFieldOptions} from '../field/FieldOptions'
import {useMemo} from 'react'
import {SelectOption} from '@hopara/design-system/src'
import {Filter} from '../../../filter/domain/Filter'
import {columnLabel} from '@hopara/dataset/src/column/Column'
import {LayerEditorOwnProps} from '../LayerEditor'
import { queryKeyToArray } from '@hopara/dataset'

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, layers, queries} = props
  const visualizations = state.visualizations
  const filters = state.visualizationFilters.filters
  const visualizationQueryColumns = useMemo(() => queries.getAllColumns(), [queries])
  const options = getFieldOptions({layer, queries, layers})

  return {
    layer,
    visualizationQueryColumns,
    layerQueryColumns: queries.getColumns(layer.getQueryKey()),
    showIconField: false,
    action: layer.actions.find((action) => action.id === state.layerStore.selectedActionId),
    fieldOptions: useMemo(() => options.fieldOptions, [queries, ...queryKeyToArray(options.queryKey)]),
    visualizations,
    zoom: state.viewState?.zoom ?? 0,
    maxZoom: state.viewState?.zoomRange?.getMax() ?? 0,
    minZoom: state.viewState?.zoomRange?.getMin() ?? 0,
    filterOptions: filters.map((filter: Filter) => {
      return {value: filter.field, label: columnLabel(filter.field)} as SelectOption
    }) as any as SelectOption[],
    filterStatus: state.visualizationFilters.state,
    showFilter: true,
  }
}

function mapActions(dispatch: Dispatch): ActionProps {
  return {
    onChange: (action): void => {
      dispatch(actions.layer.actionChanged({action}))
    },
    onBack: (): void => {
      dispatch(actions.layer.selectAction({actionId: undefined}))
    },
    onVisualizationChanged: (visualization): void => {
      dispatch(actions.action.visualizationChanged({visualization}))
    },
  }
}

export const ActionEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(ActionEditor)
