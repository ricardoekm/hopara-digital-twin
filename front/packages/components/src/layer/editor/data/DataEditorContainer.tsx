import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {ActionProps, DataEditor, StateProps} from './DataEditor'
import {shouldRenderLayerEditor} from '../selectors'
import {PageNavigation} from '@hopara/page/src/PageNavigation'
import {PageType} from '@hopara/page/src/Pages'
import {Config} from '@hopara/config'
import {LayerEditorOwnProps} from '../LayerEditor'
import { useMemo } from 'react'

function mapState(_: Store, props: LayerEditorOwnProps, navigation: PageNavigation): StateProps {
  const {layer, queries} = props
  const query = queries.findQuery(layer.getData().getQueryKey())

  const dataSources = useMemo(() => queries.getDataSources(), [queries])
  const dataSource = query?.getDataSource() ?? layer.getData().source
  const isJSSource = query ? query.isFunction() : queries.findFromDataSource(dataSource)?.isFunction()

  const dataSourceListLink = navigation.getUrl(PageType.ListDataSources)

  const dataSourceLink = dataSource && navigation.getUrl(
    PageType.ViewDataSource,
    {name: dataSource},
    {hard: Config.getValueAsBoolean('IS_EMBEDDED')})

  const queryLink = query && navigation.getUrl(
    isJSSource ? PageType.EditFunction : PageType.EditQuery,
    {dataSourceName: dataSource, name: query.getName()},
    {hard: Config.getValueAsBoolean('IS_EMBEDDED')})

  const newQueryLink = dataSource && navigation.getUrl(
    isJSSource ? PageType.CreateFunction : PageType.CreateQuery,
    {dataSourceName: dataSource},
    {hard: Config.getValueAsBoolean('IS_EMBEDDED')})

  return {
    layerId: layer.getId(),
    query,
    dataSource,
    dataSources,
    queries,
    queryLink,
    newQueryLink,
    dataSourceLink,
    dataSourceListLink,
    showInternalDataSource: true,
    isJSSource,
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (query): void => {
      dispatch(actions.layer.queryChanged({id: props.layerId!, query}))
    },
    onChangeDataSource: (dataSource): void => {
      dispatch(actions.layer.dataSourceChanged({id: props.layerId!, dataSource}))
    },
  }
}

export const DataEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions, shouldRenderLayerEditor)(DataEditor)
