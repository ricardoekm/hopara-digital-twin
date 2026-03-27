import {Dispatch} from '@reduxjs/toolkit'
import {Store} from '../../../state/Store'
import {connect} from '@hopara/state'
import {PageNavigation} from '@hopara/page/src/PageNavigation'
import { StateProps, ActionProps, ActionButtons } from './ActionButtons'
import actions from '../../../state/Actions'

export const mapState = (store: Store): StateProps => {
  const actions = store.visualizationStore.visualization.actions

  return {
    actions,
    registeredCallbacks: store.action.registeredCallbacks,
    tenant: store.auth.authorization.tenant,
  }
}

export const mapActions = (dispatch: Dispatch, _, navigation: PageNavigation): ActionProps => {
  return {
    onActionClick: (action) => {
      dispatch(actions.navigation.actionClicked({action, navigation}))
    },
  }
}

export const ActionButtonsContainer = connect(mapState, mapActions)(ActionButtons as any)
