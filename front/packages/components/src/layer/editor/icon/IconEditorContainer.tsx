import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import {Store} from '../../../state/Store'
import {shouldRenderLayerEditor} from '../selectors'
import {ActionProps, IconEditor, StateProps} from './IconEditor'
import actions from '../../../state/Actions'
import {getFieldOptions} from '../field/FieldOptions'
import {useMemo} from 'react'
import {PageNavigation} from '@hopara/page/src/PageNavigation'
import {PageType} from '@hopara/page/src/Pages'
import {resourceOptionsFilter} from '../../../OptionsFilters'
import {LayerEditorOwnProps} from '../LayerEditor'
import { queryKeyToArray } from '@hopara/dataset'

function mapState(state: Store, props: LayerEditorOwnProps): StateProps {
  const {layer, queries, layers} = props
  const tenant = state.auth.authorization.tenant
  const options = getFieldOptions({layer, queries, layers}, resourceOptionsFilter)

  return {
    layerId: layer.getId(),
    layerQueryColumns: queries.getColumns(layer.getQueryKey()),
    encoding: useMemo(() => layer.encoding.icon, [layer.encoding.icon?.getUpdatedTimestamp()]),
    fieldOptions: useMemo(() => options.fieldOptions, [queries, ...queryKeyToArray(options.queryKey)]),
    tenant,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps, navigation: PageNavigation): ActionProps {
  return {
    onChange: (encoding): void => {
      dispatch(actions.layer.encodingChanged({type: 'icon', encoding, layerId: props.layerId}))
    },
    onPreview: (encoding): void => {
      dispatch(actions.layer.encodingPreview({type: 'icon', encoding, layerId: props.layerId}))
    },
    onGoToCreateIcon: (): void => {
      navigation.navigate(PageType.CreateIcon, {name: props.tenant}, {target: '_blank'})
    },
  }
}

export const IconEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(IconEditor)
