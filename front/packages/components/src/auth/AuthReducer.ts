import {getType} from 'typesafe-actions'
import {Authorization} from '@hopara/authorization'
import actions, {ActionTypes} from '../state/Actions'
import { getSessionId } from '../analytics/SessionId'
import { AuthStatus } from '@hopara/auth-front/src/contexts/AuthContext'
import { HttpError } from '@hopara/http-client'
import { Reducer } from '@hopara/state'

interface AuthState {
  authorization: Authorization
  status: AuthStatus
}

export const authorizationReducer: Reducer<AuthState, ActionTypes> = (state, action, globalState) => {
  if (!state && !!globalState?.auth) {
    return globalState.auth
  } else if (!state) {
    return {
      status: AuthStatus.Idle,
      authorization: Authorization.createEmpty(),
    }
  }

  switch (action.type) {
    case getType(actions.auth.signedIn):
      return {
        status: action.payload.status,
        authorization: new Authorization(action.payload.authorization).setSessionId(getSessionId()),
      }
    case getType(actions.auth.signedOut):
      return {
        status: AuthStatus.SignedOut,
        authorization: Authorization.createEmpty(),
      }
    case getType(actions.auth.statusChanged):
      return {
        ...state,
        status: action.payload.status,
      }
    case getType(actions.visualization.pageLoaded):
      if (action.payload.tenant && action.payload.tenant !== state.authorization.tenant) {
        return {
          ...state,
          authorization: state.authorization.setTenant(action.payload.tenant),
        }
      }
      return state
    case getType(actions.auth.tenantChanged):
      return {
        ...state,
        authorization: state.authorization.setTenant(action.payload.tenant),
      }
    case getType(actions.auth.refreshed):
      return {
        status: action.payload.authorization.accessToken ? AuthStatus.SignedIn : AuthStatus.SignedOut,
        authorization: action.payload.authorization.setSessionId(getSessionId()),
      }
    case getType(actions.hoc.init):
    case getType(actions.hoc.accessTokenChanged):
    case getType(actions.hoc.visualizationChanged):
      return {
        status: AuthStatus.SignedIn,
        authorization: action.payload.authorization.setSessionId(getSessionId()),
      }
    case getType(actions.visualization.fetch.failure):
    case getType(actions.rowset.fetch.failure):
      if (action.payload.exception instanceof HttpError && action.payload.exception.status === 401 && !state.authorization?.isDefault()) {
        return {
          status: AuthStatus.SignedOut,
          authorization: Authorization.createEmpty(),
        }
      }
      return state
    default:
      return state
  }
}

