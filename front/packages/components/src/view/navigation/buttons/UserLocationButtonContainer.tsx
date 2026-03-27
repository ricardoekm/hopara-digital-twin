import {Dispatch} from '@reduxjs/toolkit'
import {Store} from '../../../state/Store'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import { ActionProps, StateProps, UserLocationButton } from './UserLocationButton'

export const mapState = (store: Store): StateProps => {
  return {
    showingUserLocation: store.userLocation.showing,
    loadingUserLocation: store.userLocation.loading,
  }
}

export const mapActions = (dispatch: Dispatch, stateProps: StateProps): ActionProps => {
  return {
    onClick: () => {
      if (stateProps.showingUserLocation) {
        dispatch(actions.userLocation.hide())
      } else {
        dispatch(actions.userLocation.show.request())
      }
    },
  }
}

export const shouldRender = (store: Store): boolean => {
  return store.browser.isMobile()
}

export const UserLocationButtonContainer = connect(mapState, mapActions, shouldRender)(UserLocationButton)
