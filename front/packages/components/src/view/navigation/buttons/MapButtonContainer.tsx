import {Dispatch} from '@reduxjs/toolkit'
import {Store} from '../../../state/Store'
import actions from '../../../state/Actions'
import {connect} from '@hopara/state'
import {MapStyle} from '@hopara/encoding'
import {getMapStyle} from '../../../map/MapStyleFactory'
import { ActionProps, MapButton, StateProps } from './MapButton'

export const mapState = (store: Store): StateProps => {
  return {
    currentStyle: store.objectEditor.mapStyle || getMapStyle(store.layerStore.layers, store.viewState?.zoom),
  }
}


export const mapActions = (dispatch: Dispatch): ActionProps => {
  return {
    onClick: (mapStyle: MapStyle) => {
      dispatch(actions.objectEditor.mapStyleChanged({
        mapStyle,
      }))
    },
  }
}

export const MapButtonContainer = connect(mapState, mapActions)(MapButton as any)
