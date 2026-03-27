import {createAction} from 'typesafe-actions'
import { Legends } from '../Legends'

const actions = {
  changed: createAction('LEGENDS_CHANGED')<{ legends: Legends }>(),
}

export default actions
