import React from 'react'
import { Authorization } from '@hopara/authorization'
import {AuthService} from './AuthService'

export enum AuthStatus {
  Idle,
  SignedIn,
  SignedOut,
}

export interface IAuth {
  authStatus: AuthStatus
  authorization: Authorization
  authService: AuthService
  signOut: () => void
  getRefreshedAuthorization: () => Promise<Authorization>
}

export const AuthContext = React.createContext<IAuth>({
  authStatus: AuthStatus.Idle,
  authService: new AuthService(),
  authorization: undefined as any,
  signOut: () => undefined,
  getRefreshedAuthorization: () => undefined as any,
})
