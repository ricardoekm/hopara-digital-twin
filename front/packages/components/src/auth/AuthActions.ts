import { AuthStatus } from '@hopara/auth-front/src/contexts/AuthContext'
import { Authorization } from '@hopara/authorization'
import {createAction} from 'typesafe-actions'

const actions = {
  signedIn: createAction('AUTH_SIGNED_IN')<{authorization: Authorization, status: AuthStatus}>(),
  signedOut: createAction('AUTH_SIGNED_OUT')<void>(),
  statusChanged: createAction('AUTH_STATUS_CHANGED')<{status: AuthStatus}>(),
  tenantChanged: createAction('AUTH_TENANT_CHANGED')<{tenant: string}>(),
  refreshed: createAction('AUTH_REFRESHED')<{authorization: Authorization}>(),
}

export default actions
