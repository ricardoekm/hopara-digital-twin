import {createAction} from 'typesafe-actions'
import { Position } from './ViewState'

export const viewStateActions = {
  initialPositionChanged: createAction('VIEW_STATE_INITIAL_POSITION_CHANGED')<Partial<Position>>(),
  initialPositionChangedSilently: createAction('VIEW_STATE_INITIAL_POSITION_CHANGED_SILENTLY')<Partial<Position>>(),
  transitionRotate: createAction('VIEW_STATE_TRANSITION_ROTATE')<{step: number, interval: number}>(),
}
