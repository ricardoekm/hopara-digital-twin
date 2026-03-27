import { Reducer } from 'react'
import actions, { ActionTypes } from '../state/Actions'
import { getType } from 'typesafe-actions'

type State = {
  showing?: boolean
  loading?: boolean
}

export const userLocationReducer: Reducer<State, ActionTypes> = (state = {}, action) => {
  switch (action.type) {
    case getType(actions.userLocation.show.request): {
      return { loading: true }
    }
    case getType(actions.userLocation.show.success): {
      return { showing: true, loading: false }
    }
    case getType(actions.userLocation.hide): {
      return { showing: false }
    }
    case getType(actions.userLocation.show.failure): {
      return { loading: false }
    }
    default:
      return state
  }
}
