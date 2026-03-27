import {createAction} from 'typesafe-actions'

export const browserActions = {
  init: createAction('BROWSER_INIT')<{webgl, platform, device}>(),
}
