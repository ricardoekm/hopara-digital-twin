import React from 'react'
import {connect} from 'react-redux'
import {AuthProvider} from '@hopara/auth-front/src/contexts/AuthProvider'
import actions from '../state/Actions'
import { Store } from '../state/Store'
import { Authorization } from '@hopara/authorization'
import { AuthStatus } from '@hopara/auth-front/src/contexts/AuthContext'
import { matchRoutes, useLocation } from 'react-router-dom'
import { Pages } from '@hopara/page/src/Pages'

const Comp = (props) => {
  const location = useLocation()
  const matchedRoute = matchRoutes(Pages.getAll(), location.pathname)
  return <AuthProvider {...props} matchedRoute={matchedRoute?.length ? matchedRoute[0] : undefined} />
}

export const ConnectedAuthProvider = connect((state: Store) => ({
  authorization: state.auth.authorization,
  authStatus: state.auth.status,
  visualizationId: state.visualizationStore.visualization?.id,
}), (dispatch) => {
  return {
    onSignedIn: (authorization: Authorization, status: AuthStatus) => {
      dispatch(actions.auth.signedIn({authorization, status}))
    },
    onChangeStatus: (status: AuthStatus) => {
      dispatch(actions.auth.statusChanged({status}))
    },
    onSignedOut: () => {
      dispatch(actions.auth.signedOut())
    },
    onTenantChanged: (tenant: string) => {
      dispatch(actions.auth.tenantChanged({tenant}))
    },
    onTokenRefreshed: (authorization: Authorization) => {
      dispatch(actions.auth.refreshed({authorization}))
    },
  }
})(Comp)
