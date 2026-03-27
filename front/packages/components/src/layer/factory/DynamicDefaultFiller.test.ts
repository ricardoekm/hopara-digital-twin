import { Encodings, MaxLengthType, PositionEncoding } from '@hopara/encoding'
import { getAnyLayer } from '../Layer.test'
import { LayerType } from '../LayerType'
import { DynamicDefaultsFiller } from './DynamicDefaultsFiller'
import { DataRef } from '@hopara/encoding'
import { Layers } from '../Layers'
import { PositionType } from '@hopara/encoding/src/position/PositionEncoding'
import { ExternalLinkJump, ZoomJump } from '../../action/Action'
import { Details } from '../../details/Details'
import { Column, Columns, ColumnType, Queries, Query } from '@hopara/dataset'
import { Actions } from '../../action/Actions'

test('If a text layer points to coordinates based layer, max length should be auto', () => {
  const textPositionEncoding = new PositionEncoding({data: new DataRef({layerId: 'polygonLayer'}), type: PositionType.REF})
  const textLayer = getAnyLayer({type: LayerType.text, encoding: new Encodings({position: textPositionEncoding})})

  const polygonPositionEncoding = new PositionEncoding({coordinates: { field: 'geometry'}})
  const polygonLayer = getAnyLayer({id: 'polygonLayer', type: LayerType.polygon, encodings: new Encodings({position: polygonPositionEncoding})})

  const dynamicDefaultFiller = new DynamicDefaultsFiller({})
  dynamicDefaultFiller.fillTextDefaults(textLayer, new Layers(textLayer, polygonLayer) as any)
  expect(textLayer.encoding.text?.maxLength?.type).toBe(MaxLengthType.AUTO)
})

test('Zoom action should be auto trigger', () => {
  const actions = new Actions(new ZoomJump(), new ExternalLinkJump())
  const layer = getAnyLayer({actions})

  const dynamicDefaultFiller = new DynamicDefaultsFiller({})
  dynamicDefaultFiller.fillActionTrigger(layer)
  expect(layer.actions[0].trigger).toBe('OBJECT_CLICK')
  expect(layer.actions[1].trigger).toBeUndefined()
})

test('text field should be suggested as details title', () => {
  const layer = getAnyLayer({details: new Details({})})
  
  const columns = new Columns()
  columns.push(new Column({name: 'id', type: ColumnType.INTEGER, primaryKey: true}))
  columns.push(new Column({name: 'alert', type: ColumnType.BOOLEAN}))
  columns.push(new Column({name: 'name', type: ColumnType.STRING}))
  
  const query = new Query({name: layer.data.query, dataSource: layer.data.source, columns})
  const queries = new Queries()
  queries.push(query)
  
  const dynamicDefaultFiller = new DynamicDefaultsFiller({queries})
  dynamicDefaultFiller.fillDefaultDetails(layer)

  const detailsFields = layer.details.fields
  expect(detailsFields[0].getField()).toEqual('name')
})
