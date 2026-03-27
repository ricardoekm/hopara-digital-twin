import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {ActionProps, StateProps} from './TextFormatEditor'
import {TextEncoding} from '@hopara/encoding'
import {getFieldOptions} from '../field/FieldOptions'
import {useMemo} from 'react'
import {notComplexOptionsFilter} from '../../../OptionsFilters'
import {LayerEditorOwnProps} from '../LayerEditor'
import {TextFormatEditor} from './TextFormatEditor'
import { queryKeyToArray } from '@hopara/dataset'
import { SizeUnits } from '@hopara/encoding/src/size/SizeEncoding'

function mapState(_: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, layers, queries} = props
  const options = getFieldOptions({layer, queries, layers}, notComplexOptionsFilter)
  const layerQuery = queries.findQuery(layer.getQueryKey())

  return {
    layer,
    layerQueryColumns: layerQuery?.columns,
    isCoordinatesBased: layer.isCoordinatesBased(),
    encoding: new TextEncoding(layer.encoding.text ?? {}),
    resizeOn: layer.encoding.config?.units === SizeUnits.COMMON,
    fieldOptions: useMemo(() => options.fieldOptions, [queries, ...queryKeyToArray(options.queryKey)]),
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (name): void => {
      dispatch(actions.layer.encodingChanged({type: 'text', encoding: name, layerId: props.layer.getId()}))
    },
  }
}

export const TextFormatEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(TextFormatEditor)
