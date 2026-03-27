import {Store} from '../../state/Store'
import actions from '../../state/Actions'
import {connect} from '@hopara/state'
import {Dispatch} from '@reduxjs/toolkit'
import { COLOR_MANAGED_FIELD, REFERENCE_ZOOM_MANAGED_FIELD, SIZE_MANAGED_FIELD, SizeUnits, VIEW_MANAGED_FIELD } from '@hopara/encoding'
import { StateProps, ActionProps, ObjectAppearanceEditor } from './ObjectAppearanceEditor'
import { LayerType } from '../../layer/LayerType'

export function mapState(state: Store): StateProps {
  const layers = state.layerStore.layers
  const layer = layers.getById(state.details.layerId)!
  const row = state.details.row

  let colorValue = layer.getColorEncoding()?.value
  if (layer.getColorEncoding()?.isManaged() && row!.getValue(COLOR_MANAGED_FIELD)) {
    colorValue = row!.getValue(COLOR_MANAGED_FIELD)
  }

  let sizeEncoding = layer.getSizeEncoding()!
  if (layer.getSizeEncoding()?.isManaged()) {
    sizeEncoding = layer.getSizeEncoding()?.coalesceMutate(row!.getValue(SIZE_MANAGED_FIELD), row?.getValue(REFERENCE_ZOOM_MANAGED_FIELD))!
  }

  return {
    canSetColor: layer.getColorEncoding()?.isManaged(),
    canSetSize: layer.getSizeEncoding()?.isManaged() && !layer.isCoordinatesBased(),
    colorValue,
    sizeUnits: layer.encoding.config?.units as SizeUnits,
    sizeEncoding,
    maxSize: layer.isType(LayerType.line) ? 50 : undefined,
    rowsetId: layer.getRowsetId(),
    positionData: layer.getPositionData(),
    row: row!,
    zoom: state.viewState!.zoom,
  }
}

export function mapActions(dispatch: Dispatch, props: StateProps): ActionProps {
  return {
      onColorChange: (value?: string) => {
        if (!value) return

        dispatch(actions.object.appearanceUpdated({
          row: props.row,
          rowsetId: props.rowsetId as string,
          data: props.positionData,
          type: 'COLOR',
          updatedFields: {
            [COLOR_MANAGED_FIELD]: value,
          },
        }))
    },
    onViewChange: (value?: string) => {
        dispatch(actions.object.appearanceUpdated({
          row: props.row,
          rowsetId: props.rowsetId as string,
          data: props.positionData,
          type: 'VIEW',
          updatedFields: {
            [VIEW_MANAGED_FIELD]: value,
          },
        }))
    },
    onResetColor: () => {
      dispatch(actions.object.appearanceUpdated({
        row: props.row,
        rowsetId: props.rowsetId as string,
        data: props.positionData,
        type: 'COLOR',
        updatedFields: {
          [COLOR_MANAGED_FIELD]: null,
        },
      }))
    },
    onSizeChange: (value: number) => {
      if (!value) return

      dispatch(actions.object.appearanceUpdated({
        row: props.row,
        rowsetId: props.rowsetId as string,
        data: props.positionData,
        type: 'SIZE',
        updatedFields: {
          [SIZE_MANAGED_FIELD]: value,
          [REFERENCE_ZOOM_MANAGED_FIELD]: props.zoom,
        },
      }))
    },
    onResetSize: () => {
      dispatch(actions.object.appearanceUpdated({
        row: props.row,
        rowsetId: props.rowsetId as string,
        data: props.positionData,
        type: 'SIZE',
        updatedFields: {
          [SIZE_MANAGED_FIELD]: null,
          [REFERENCE_ZOOM_MANAGED_FIELD]: undefined,
        },
      }))
    },
  }
}

export const ObjectAppearanceEditorContainer = connect(mapState, mapActions)(ObjectAppearanceEditor)
