import React, { useEffect, useState } from 'react'
import {connect} from 'react-redux'
import jwtDecode from 'jwt-decode'
import { Logger } from '@hopara/internals'
import actions, { HocLoadedPayload } from '@hopara/components/src/hoc/HocActions'
import { InitialRow } from '@hopara/components/src/initial-row/InitialRow'
import { HoparaController } from '@hopara/components/src/hoc/HoparaController'
import { Config, ConfigEnvironment } from '@hopara/config'
import { CallbackFunction } from '@hopara/components/src/action/ActionReducer'
import { SelectedFilter } from '@hopara/components/src/filter/domain/SelectedFilter'
import { SelectedFilters } from '@hopara/components/src/filter/domain/SelectedFilters'
import { Authorization } from '@hopara/authorization'
import { Store } from '@hopara/components/src/state/Store'
import { getPageUrl } from '@hopara/page/src/PageNavigation'
import { PageType } from '@hopara/page/src/Pages'
import { useNavigate } from 'react-router-dom'
import { FilterStore } from '@hopara/components/src/filter/state/FilterStore'
import QueryStore from '@hopara/components/src/query/QueryStore'
import { isEqual } from 'lodash/fp'
import { PlainDataLoader } from '@hopara/dataset/src/loader/DataLoader'
import { Language } from '@hopara/browser'

export enum HoparaTab {
  OBJECTS='objects',
  LAYERS='layers',
  SETTINGS='settings',
  VISUALIZATION='visualization'
}

export type EmbeddedProps = {
  env?: ConfigEnvironment
  visualizationId: string
  fallbackVisualizationId?: string
  visualizationScope?: string
  accessToken: string
  refreshToken?: string
  tenant?: string
  dataLoaders?: PlainDataLoader[]
  initialRow?: InitialRow
  controller?: HoparaController
  darkMode?: boolean
  callbacks?: CallbackFunction[]
  attribution?: boolean
  filters?: Partial<SelectedFilter>[]
  language?: Language
  initialTab?: HoparaTab
  navigationControls?: boolean
}

const logInit = (message:string, props: EmbeddedProps) => {
  Logger.debug(message, {
    visualizationId: props.visualizationId,
    accessToken: props.accessToken ? `${props.accessToken?.substring(0, 50)}...` : undefined,
  })
}

const getDecodedToken = (accessToken: string) => {
  try {
    return jwtDecode<any>(accessToken)
  } catch {
    return {}
  }
}

interface ProviderStateProps extends EmbeddedProps {
  stateVisualizationId: string
  stateFallbackVisualizationId: string
  stateTenant: string
  stateAuthorization?: Authorization
  filterStore: FilterStore
  queryStore: QueryStore
}

interface ProviderStateActions {
  onLoad: (navigateToTabUrl) => void
  onUpdate: () => void
  onVisualizationChanged: (navigateFn: any, tenant: string) => void
  forceRefresh: () => void
  onTabChange: (navigateFn: any, tab: HoparaTab) => void
}

const Provider = (props: ProviderStateProps & ProviderStateActions) => {
  const navigate = useNavigate()
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [oldVisualization, setOldVisualizationId] = useState({id: props.visualizationId, fallback: props.fallbackVisualizationId})
  const [oldToken, setOldToken] = useState({token: props.accessToken, refreshToken: props.refreshToken, tenant: props.tenant})
  const [oldFilters, setOldFilters] = useState(props.filters)
  const [oldDataLoaders, setOldDataLoaders] = useState(props.dataLoaders)
  const [oldInitialRow, setOldInitialRow] = useState(props.initialRow)
  const [oldInitialTab, setOldInitialTab] = useState(props.initialTab)

  const isRenderable = !!props.accessToken && !!props.visualizationId
  const isTokenRefreshable = !!props.accessToken && !!props.refreshToken

  const hasVisualizationChanged = !isEqual(oldVisualization.id, props.visualizationId) || !isEqual(oldVisualization.fallback, props.fallbackVisualizationId)
  const hasTokenChanged = !isTokenRefreshable && (!isEqual(oldToken.token, props.accessToken) || !isEqual(oldToken.refreshToken, props.refreshToken))
  const hasFiltersChanged = !isEqual(oldFilters, props.filters)
  const hasDataLoadersChanged = !isEqual(oldDataLoaders, props.dataLoaders)
  const hasInitialRowChanged = !isEqual(oldInitialRow, props.initialRow)
  const hasInitialTabChanged = !isEqual(oldInitialTab, props.initialTab)

  const shouldUpdate = hasVisualizationChanged || hasTokenChanged || hasFiltersChanged || hasDataLoadersChanged || hasInitialRowChanged || hasInitialTabChanged

  useEffect(() => {
    if (!shouldUpdate || !isRenderable) return
    if (props.controller) props.controller.setRefreshSignal(props.forceRefresh)
    if (props.env && props.env !== Config.environment) Config.setEnv(props.env)

    setOldToken({token: props.accessToken, refreshToken: props.refreshToken, tenant: props.tenant})
    setOldVisualizationId({id: props.visualizationId, fallback: props.fallbackVisualizationId})
    setOldFilters(props.filters)
    setOldDataLoaders(props.dataLoaders)
    setOldInitialRow(props.initialRow)
    setOldInitialTab(props.initialTab)

    if (isFirstLoad) {
      setIsFirstLoad(false)
      return props.onLoad((navigateToTabUrl) => navigate(navigateToTabUrl, {replace: false, state: {jumpBack: false}}))
    } else if (hasVisualizationChanged) {
      props.onVisualizationChanged((url) => navigate(url, {replace: false, state: {jumpBack: false}}), props.tenant ?? props.stateTenant)
    } else if (hasInitialTabChanged && props.initialTab) {
      props.onTabChange((url) => navigate(url, {replace: false, state: {jumpBack: false}}), props.initialTab)
    } else {
      props.onUpdate()
    }
  }, [props.visualizationId, props.accessToken, props.refreshToken, props.tenant, props.filters, props.dataLoaders, props.initialTab, shouldUpdate])

  return <></>
}

const tabToPageType = (tab: HoparaTab): PageType => {
  switch (tab) {
    case HoparaTab.LAYERS:
      return PageType.VisualizationLayerEditor
    case HoparaTab.OBJECTS:
      return PageType.VisualizationObjectEditor
    case HoparaTab.SETTINGS:
      return PageType.VisualizationSettings
    default:
      return PageType.VisualizationDetail
  }
}

const mapState = (state: Store, props: EmbeddedProps): ProviderStateProps => {
  return {
    ...props,
    tenant: props.tenant,
    stateTenant: state.auth.authorization.tenant,
    visualizationId: props.visualizationId ?? '',
    stateVisualizationId: state.visualizationStore.visualization?.id ?? '',
    stateFallbackVisualizationId: state.visualizationStore.fallbackVisualizationId ?? '',
    stateAuthorization: state.auth.authorization,
    filterStore: state.filterStore,
    queryStore: state.queryStore,
  }
}

const mapActions = (dispatch: any, props: EmbeddedProps): ProviderStateActions => {
  const getActionPayload = (): HocLoadedPayload => {
    const {tenants = [], scope = '', exp = 0, username} = getDecodedToken(props.accessToken)
    const authorization = new Authorization({
      accessToken: props.accessToken,
      refreshToken: props.refreshToken,
      expiration: exp,
      tenant: props.tenant ?? tenants[0],
      tenants,
      permissions: scope?.split(' '),
      clientId: username,
    })

    const filters = props.filters?.length ?
                    new SelectedFilters(...props.filters.map((filter) => new SelectedFilter(filter))) :
                    undefined

    return {
      visualizationId: props.visualizationId,
      fallbackVisualizationId: props.fallbackVisualizationId,
      visualizationScope: props.visualizationScope,
      dataLoaders: props.dataLoaders,
      initialRow: props.initialRow,
      darkMode: !!props.darkMode,
      callbacks: props.callbacks,
      filters,
      authorization,
      language: props.language,
      navigationControls: props.navigationControls,
    }
  }

  return {
    onLoad: (navigate) => {
      logInit('initializing module', props)

      const actionPayload = getActionPayload()
      dispatch(actions.configLoaded(actionPayload))      
      if (!props.initialTab) return

      const initalTabURL = getPageUrl(
        tabToPageType(props.initialTab),
        actionPayload.authorization.tenant,
        {
          visualizationId: props.visualizationId,
          fallbackVisualizationId: props.fallbackVisualizationId,
          visualizationScope: props.visualizationScope,
          initialLayerId: props.initialRow?.layerId,
          initialRowId: props.initialRow?.rowId,
          filters: props.filters,
        },
      )

      return navigate(initalTabURL)
    },
    onTabChange: (navigate: any, tab: HoparaTab) => {
      const actionPayload = getActionPayload()
      const initalTabURL = getPageUrl(
        tabToPageType(tab),
        actionPayload.authorization.tenant,
        {
          visualizationId: props.visualizationId,
          fallbackVisualizationId: props.fallbackVisualizationId,
          visualizationScope: props.visualizationScope,
          initialLayerId: props.initialRow?.layerId,
          initialRowId: props.initialRow?.rowId,
          filters: props.filters,
        },
      )

      return navigate(initalTabURL)
    },
    onUpdate: () => {
      logInit('updating module', props)
      dispatch(actions.configUpdated(getActionPayload()))
    },
    onVisualizationChanged: (navigate, tenant) => {
      if (!tenant) {
        tenant = getActionPayload().authorization.tenant
      }

      const url = getPageUrl(
        PageType.VisualizationDetail,
        tenant,
        {
          visualizationId: props.visualizationId,
          fallbackVisualizationId: props.fallbackVisualizationId,
          visualizationScope: props.visualizationScope,
          initialLayerId: props.initialRow?.layerId,
          initialRowId: props.initialRow?.rowId,
          filters: props.filters,
        },
      )

      return navigate(url)
    },
    forceRefresh: () => dispatch(actions.forceRefresh()),
  }
}

export const EmbeddedProvider = connect(mapState, mapActions)(Provider)
