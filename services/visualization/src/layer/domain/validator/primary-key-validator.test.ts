import { ColumnsMap } from '../../../data/ColumnsMap.js'
import { QueryKey } from '../../../data/QueryKey.js'
import { Columns } from '../../../data/query/Columns.js'
import { PrimaryKeyValidator } from './primary-key-validator.js'
import {CircleLayerImpl} from '../CircleLayerImpl.js'
import {LayerType} from '../spec/LayerType.js'

it('if layer has separate position data both should have primary key', () => {
  const layer = new CircleLayerImpl({
    type: LayerType.circle,
    id: 'my-layer',
    data: {
      source: 'hopara',
      query: 'sensors', 
    },
    encoding: {
      position: {
        data: {
          source: 'hopara',
          query: 'sensors_pos',
        },
      },
    },
  } as any)

  const sensorsQueryKey = new QueryKey({source: 'hopara', query: 'sensors'})
  const sensorsColumns = new Columns()
  sensorsColumns.push({name: 'id'} as any)  

  const sensorsPosQueryKey = new QueryKey({source: 'hopara', query: 'sensors_pos'})
  const sensorsPosColumns = new Columns()
  sensorsPosColumns.push({name: 'id', primaryKey: true} as any)  

  const columnsMap = new ColumnsMap()
  columnsMap.add(sensorsQueryKey, sensorsColumns)
  columnsMap.add(sensorsPosQueryKey, sensorsPosColumns)

  const primaryKeyValidator = new PrimaryKeyValidator()
  const error = primaryKeyValidator.validate(layer as any, columnsMap)
  expect(error).toEqual(primaryKeyValidator.generateError(sensorsQueryKey, layer))
})

it('if layer has data ref', () => {
  const layer = new CircleLayerImpl({
    type: LayerType.circle,
    id: 'my-layer',
    data: {
      source: 'hopara',
      query: 'sensors', 
    },
    encoding: {
      position: {
        data: {
          layerId: 'ref-layer',
        },
      },
    },
  } as any)

  const sensorsQueryKey = new QueryKey({source: 'hopara', query: 'sensors'})
  const sensorsColumns = new Columns()
  sensorsColumns.push({name: 'id'} as any)  

  const sensorsPosQueryKey = new QueryKey({source: 'hopara', query: 'sensors_pos'})
  const sensorsPosColumns = new Columns()
  sensorsPosColumns.push({name: 'id', primaryKey: true} as any)  

  const columnsMap = new ColumnsMap()
  columnsMap.add(sensorsQueryKey, sensorsColumns)
  columnsMap.add(sensorsPosQueryKey, sensorsPosColumns)

  const primaryKeyValidator = new PrimaryKeyValidator()
  const error = primaryKeyValidator.validate(layer as any, columnsMap)
  expect(error).toBeUndefined()
})
