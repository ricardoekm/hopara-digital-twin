import React from 'react'
import {Store} from '../../state/Store'
import actions from '../../state/Actions'
import {createDetailLines} from '../DetailsLineFactory'
import {ActionProps, DetailsComponent, StateProps} from './DetailsComponent'
import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import { Action } from '../../action/Action'
import { PageNavigation } from '@hopara/page/src/PageNavigation'
import { i18n } from '@hopara/i18n'

const PDF_LIST_MARRETA = [
  {
    name: i18n('PDF_1'),
    url: 'https://statics.hopara.app/uploads/hopara.io/2025/05/13/SGT6-5000F-01.pdf',
  },
  {
    name: i18n('PDF_2'),
    url: 'https://statics.hopara.app/uploads/hopara.io/2025/05/13/SGT6-5000F-02.pdf',
  }, 
]

export function mapState(state: Store): StateProps {
  const layers = state.layerStore.layers
  const layer = layers.getById(state.details.layerId)!
  const tenant = state.auth.authorization.tenant
  const query = state.queryStore.queries.findQuery(layer?.getQueryKey())
  const row = state.details.row!
  const pdfs = state.visualizationStore.visualization.id === 'lab-3d-machine' && layer.getId() === '#machine-model' ? PDF_LIST_MARRETA : []

  return {
    rowset: state.rowsetStore.getRowset(layer!.getRowsetId())!,
    tenant,
    registeredCallbacks: state.action.registeredCallbacks,
    layer,
    row,
    lines: React.useMemo(() => createDetailLines(row, tenant, query?.getColumns(), layer?.details), [row, layer]),
    authorization: state.auth.authorization,
    lastImageVersionDate: state.imageHistory.lastModified,
    pdfs,
  }
}

export function mapActions(dispatch: Dispatch, props: StateProps, navigation: PageNavigation): ActionProps {
  return {
    onActionClick: (action:Action) => {
      dispatch(actions.details.actionClicked({action, layerId: props.layer.getId(), row: props.row, navigation}))
    },
    onCloseButtonClick: () => {
      dispatch(actions.details.closeClicked())
    },
  }
}

function shouldRender(state: Store) {
  const layers = state.layerStore.layers
  return !!layers.getById(state.details.layerId)
}

export const DetailsContainer = connect(mapState, mapActions, shouldRender)(DetailsComponent)
