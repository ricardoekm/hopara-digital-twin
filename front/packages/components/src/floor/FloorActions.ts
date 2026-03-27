import {createAction} from 'typesafe-actions'
import {Floor} from './Floor'
import {Floors} from './Floors'

export const floorActions = {
  floorFetched: createAction('FLOORS_FETCHED')<{ visualizationFloors: Floors, dataFloors: Floors }>(),
  checked: createAction('FLOORS_CHECKED')<void>(),
  changed: createAction('FLOORS_CHANGED')<{ floor: Floor | undefined }>(),
  added: createAction('FLOOR_ADD_REQUESTED')<void>(),
  deleted: createAction('FLOOR_DELETE_REQUESTED')<{ id: string }>(),
  selected: createAction('FLOOR_SELECTED')<{ id?: string }>(),
  reordered: createAction('FLOORS_REORDERED')<{ sourceIndex: number; destinationIndex: number }>(),
  nameChanged: createAction('FLOOR_NAME_CHANGED')<{ id: string; name: string }>(),
  throw: createAction('FLOOR_THROW')<{ error: Error }>(),
}
