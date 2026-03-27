import {createAction} from 'typesafe-actions'

export interface GenericErrorPayload {
  reason: string,
  exception?: unknown
  toast?: boolean
}

const actions = {
  genericError: createAction('ERROR')<GenericErrorPayload>(),
}

export default actions
