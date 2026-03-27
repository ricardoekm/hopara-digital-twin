import {createAction} from 'typesafe-actions'
import { LightName } from './Lights'


export const lightActions = {
  onLightChanged: createAction('LIGHT_ON_LIGHT_CHANGED')<{ name: LightName, light: any }>(),
}
