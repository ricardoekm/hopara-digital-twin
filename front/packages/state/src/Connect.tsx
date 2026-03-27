import React, {useCallback} from 'react'
import {mapValues} from 'lodash/fp'
import {Dispatch} from '@reduxjs/toolkit'
import {PageNavigation, usePageNavigation} from '@hopara/page/src/PageNavigation'
import {useDispatch, useSelector} from 'react-redux'

export type MapStateFn<TStateProps, TOwnProps, TStore> = (state: TStore, props: TOwnProps, navigation: PageNavigation) => TStateProps
export type MapActionFn<TStateProps, TActionProps> = (dispatch: Dispatch, stateProps: TStateProps, navigation: PageNavigation) => TActionProps

function decorateWithUseCallback(actionProps: any, cacheKeys: any[]) {
  return mapValues((callback) =>
    useCallback(callback as Function, cacheKeys), actionProps)
}

function getActionProps<StateProps, ActionsProps>(
  dispatch: Dispatch,
  stateProps: StateProps,
  mapActions: MapActionFn<StateProps, ActionsProps> | undefined,
  navigation: PageNavigation,
  language: string,
): ActionsProps {
  if (!mapActions) return {} as ActionsProps
  const cacheKeys = Object.values(stateProps || {}).concat(navigation).concat(language)
  return decorateWithUseCallback(mapActions(dispatch, stateProps, navigation), cacheKeys) as ActionsProps
}

function RenderableComponent<TOwnProps>(props: any) {
  const {mapState, mapActions, Component, ...ownProps} = props
  const store = useSelector((store) => store) as { auth: { authorization: { tenant: string } } }
  const navigation = usePageNavigation(store.auth.authorization.tenant)
  const dispatch = useDispatch()

  const stateProps = mapState(store, ownProps as TOwnProps, navigation)
  const actionProps = getActionProps(dispatch, stateProps, mapActions, navigation, (store as any).browser?.language) as any
  const componentProps = {
    ...stateProps,
    ...actionProps,
  }

  return <Component {...componentProps as any} />
}

export function connect<
  TStateProps,
  TActionProps = {},
  TOwnProps = {},
  TStore = any,
>(
  mapState: MapStateFn<TStateProps, TOwnProps, TStore> = (_, ownProps) => ({...ownProps} as any),
  mapActions?: MapActionFn<TStateProps, TActionProps>,
  shouldRender?: (store: TStore) => boolean,
) {
  return (Component: typeof React.PureComponent<TStateProps & TActionProps>): ((props?: TOwnProps) => React.ReactElement | null) => {
    const connectedComponent = (props?: TOwnProps): (null | React.ReactElement) => {
      const store = useSelector((store) => store) as TStore
      if (shouldRender && !shouldRender(store)) return null

      return <RenderableComponent {...props}
                                  Component={Component}
                                  mapState={mapState}
                                  mapActions={mapActions} />
    }

    connectedComponent.displayName = 'ConnectedComponent'
    return connectedComponent
  }
}
