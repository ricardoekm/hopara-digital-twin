import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {ActionProps, DetailsFieldEditor, StateProps} from './DetailsFieldEditor'
import actions from '../../../state/Actions'
import {getFieldOptions} from '../field/FieldOptions'
import {useMemo} from 'react'
import {notComplexOptionsFilter} from '../../../OptionsFilters'
import {LayerEditorOwnProps} from '../LayerEditor'
import { queryKeyToArray } from '@hopara/dataset'

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, queries, layers} = props
  const detailsField = layer.details.fields?.find((detailsField) => detailsField.getField() === state.layerStore.selectedDetailsField)
  const options = getFieldOptions({layer, queries, layers}, notComplexOptionsFilter)

  return {
    layer,
    detailsField,
    fieldOptions: useMemo(() => options.fieldOptions, [queries, ...queryKeyToArray(options.queryKey)]),
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (detailsField) => {
      const index = props.layer.details.fields.findIndex((d) => d.getField() === detailsField.getField())
      if (index > -1) {
        props.layer.details.fields[index] = detailsField
        dispatch(actions.layer.changed({id: props.layer.getId(), change: {details: props.layer.details}}))
      }
    },
    onBack: (): void => {
      dispatch(actions.layer.selectDetailsField({field: undefined}))
    },
  }
}

export const DetailsFieldEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(DetailsFieldEditor)
