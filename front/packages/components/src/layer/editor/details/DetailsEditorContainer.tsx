import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {ActionProps, DetailsEditor, StateProps} from './DetailsEditor'
import {Columns} from '@hopara/dataset'
import {LayerEditorOwnProps} from '../LayerEditor'
import { useMemo } from 'react'

function mapState(_: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, queries} = props
  const query = queries.findQuery(layer.getQueryKey())
  const columns = useMemo(() => query?.getColumns(layer.getTransformType()) ?? new Columns(), [query, layer.getTransformType()])

  return {
    layerId: layer.getId(),
    details: layer.details,
    columns,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (details): void => {
      dispatch(actions.layer.changed({id: props.layerId, change: {details}}))
    },
    onItemClick: (field): void => {
      dispatch(actions.layer.selectDetailsField({field}))
    },
  }
}

export const DetailsEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(DetailsEditor)
