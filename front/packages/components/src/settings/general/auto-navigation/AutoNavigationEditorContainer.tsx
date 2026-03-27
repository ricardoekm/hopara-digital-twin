import { Dispatch } from '@reduxjs/toolkit'
import { connect } from '@hopara/state'
import actions from '../../../state/Actions'
import { Store } from '../../../state/Store'
import { AutoNavigationEditor } from './AutoNavigationEditor'
import { useMemo } from 'react'
import { SelectOption } from '@hopara/design-system/src/form'
import { AutoNavigation } from '../../../auto-navigation/AutoNavigation'
import { Columns } from '@hopara/dataset'
import { i18n } from '@hopara/i18n'

interface StateProps {
  layerOptions: SelectOption[]
  selectedLayerId?: string
  conditionFieldOptions: SelectOption[]
  selectedConditionField?: string
  selectedLayerColumns?: Columns
  isAutoNavigationActive?: boolean
}

interface ActionProps {
  onLayerChange: (layerId: string) => void
  onConditionChange: (field: string) => void
}

function mapState(state: Store): StateProps {
  const layers = state.layerStore.layers
  const autoNavigation = state.visualizationStore.visualization.autoNavigation
  const queries = state.queryStore.queries
  const isAutoNavigationActive = state.viewState?.autoNavigate ?? false

  // Transform layers to select options with "None" option
  const layerOptions = useMemo(() => {
    const options = layers.map((layer) => ({
      value: layer.getId(),
      label: layer.name,
    } as SelectOption))
    
    // Add "None" option at the beginning to allow disabling the feature
    options.unshift({ value: '', label: i18n('NONE_FEMALE') } as SelectOption)
    
    return options
  }, [layers])

  // Get columns for the selected layer
  const selectedLayerId = autoNavigation?.layerId
  const selectedLayer = selectedLayerId ? layers.getById(selectedLayerId) : undefined
  
  // Get columns for the selected layer (as SelectOption[] for FieldEditor)
  const { conditionFieldOptions, selectedLayerColumns } = useMemo(() => {
    if (!selectedLayer) {
      return { conditionFieldOptions: [], selectedLayerColumns: undefined }
    }
    
    const query = queries.findQuery(selectedLayer.getQueryKey())
    if (!query) {
      return { conditionFieldOptions: [], selectedLayerColumns: undefined }
    }
    
    const columns = query.getColumns(selectedLayer.getTransformType())
    const options = columns.map((col) => ({
      value: col.name,
      label: col.getLabel(),
    } as SelectOption))
    
    return { 
      conditionFieldOptions: options,
      selectedLayerColumns: columns
    }
  }, [selectedLayer, queries])

  const selectedConditionField = autoNavigation?.condition?.test?.field

  return {
    layerOptions,
    selectedLayerId,
    conditionFieldOptions,
    selectedConditionField,
    selectedLayerColumns,
    isAutoNavigationActive,
  }
}

function mapActions(dispatch: Dispatch, stateProps: StateProps): ActionProps {
  return {
    onLayerChange: (layerId: string): void => {
      const autoNavigation: AutoNavigation | undefined = layerId ? {
        layerId,
        condition: undefined,
      } : undefined

      // If changing to "None" and auto navigation is currently active, stop it
      if (!layerId && stateProps.isAutoNavigationActive) {
        dispatch(actions.navigation.stopAutoNavigateClicked())
      }

      dispatch(actions.visualization.autoNavigationChanged({ autoNavigation }))
    },
    onConditionChange: (field: string): void => {
      const autoNavigation: AutoNavigation | undefined = stateProps.selectedLayerId ? {
        layerId: stateProps.selectedLayerId,
        condition: field ? { test: { field } } : undefined,
      } : undefined

      dispatch(actions.visualization.autoNavigationChanged({ autoNavigation }))
    },
  }
}

export const AutoNavigationEditorContainer = connect<StateProps, ActionProps>(
  mapState,
  mapActions
)(AutoNavigationEditor)

