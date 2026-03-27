import { createAction } from 'typesafe-actions'

export type FailurePayload = {
  reason:string
  exception?:any
}

export const failureAction = createAction('FAILURE')<FailurePayload>()
