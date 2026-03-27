import {Dispatch} from '@reduxjs/toolkit'
import {connect} from '@hopara/state'
import actions from '../../../state/Actions'
import {Store} from '../../../state/Store'
import {ActionProps, StateProps, MapEditor} from './MapEditor'
import {MapEncoding} from '@hopara/encoding'
import {LayerEditorOwnProps} from '../LayerEditor'

function mapState(_: Store, props: LayerEditorOwnProps): StateProps {
  const {layer} = props
  return {
    layer,
    encoding: new MapEncoding(layer.encoding.map),
  }
}

function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
    onChange: (mapEncoding): void => {
      dispatch(actions.layer.encodingChanged({type: 'map', encoding: mapEncoding, layerId: props.layer.getId()}))
    },
  }
}

export const MapEditorContainer = connect<StateProps, ActionProps, LayerEditorOwnProps>(mapState, mapActions)(MapEditor)
