import { Coordinates, RowCoordinates } from '@hopara/spatial'
import { Row } from '@hopara/dataset'
import { EditCallbackFactory, EditCallbackProps } from './EditCallbackFactory'
import { RowEditType } from './RowEdit'

describe('event info', () => {
  test('layer is not the created one', () => {
    const editCallbackProps = {layerId: 'test2'} as EditCallbackProps
    const info = {layer: {props: {layerId: 'test'}}}
  
    expect(EditCallbackFactory.getInteractionInfo(info, editCallbackProps)).toBeUndefined()
  })

  test('simple', () => {
    const editCallbackProps = {editable: false, layerId: 'testLayerId', rowsetId: 'testRowsetId'} as EditCallbackProps
    const info = {
      layer: {props: {layerId: 'testLayerId'}},
      object: {
        _id: 'rowId', a: 'value1', b: 'value2',
        _coordinates: new RowCoordinates({x: 1, y: 2, z: 3}),
      },
      coordinate: [4, 5, 6],
      pixel: [100, 200, 300],
    }
  
    expect(EditCallbackFactory.getInteractionInfo(info, editCallbackProps)).toEqual({
      layerId: editCallbackProps.layerId,
      rowsetId: editCallbackProps.rowsetId,
      editable: editCallbackProps.editable,
      row: new Row(info.object),
      rowCoordinates: new RowCoordinates({x: info.coordinate[0] - 3, y: info.coordinate[1] - 3, z: info.coordinate[2] - 3}),
      pixel: new Coordinates({x: info.pixel[0], y: info.pixel[1], z: info.pixel[2]}),
      editType: RowEditType.NONE,
      cursorDisplacement: {
        x: 3,
        y: 3,
        z: 3,
      },
    })
  })

  test('editing simple', () => {
    const editCallbackProps = {editable: true, layerId: 'testLayerId', rowsetId: 'testRowsetId'} as EditCallbackProps
    const info = {
      layer: {props: {layerId: 'testLayerId'}},
      object: {
        _id: 'rowId', a: 'value1', b: 'value2',
        _coordinates: new RowCoordinates({x: 1, y: 2, z: 3}),
      },
      editType: RowEditType.NONE,
      coordinate: [4, 5, 6],
      pixel: [100, 200, 300],
    }
  
    expect(EditCallbackFactory.getInteractionInfo(info, editCallbackProps, undefined)).toEqual({
      layerId: editCallbackProps.layerId,
      rowsetId: editCallbackProps.rowsetId,
      editable: editCallbackProps.editable,
      row: new Row(info.object),
      editType: RowEditType.NONE,
      rowCoordinates: new RowCoordinates({x: info.coordinate[0] - 3, y: info.coordinate[1] - 3, z: info.coordinate[2] - 3}),
      pixel: new Coordinates({x: info.pixel[0], y: info.pixel[1], z: info.pixel[2]}),
      cursorDisplacement: {x: 3, y: 3, z: 3},
    })
  })
})
