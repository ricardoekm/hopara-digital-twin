import { matchRoutes, useLocation } from 'react-router-dom'
import { datadogRum } from '@datadog/browser-rum'
import { PageType, Pages } from '@hopara/page/src/Pages'
import { useEffect } from 'react'

const getRouteName = (type: PageType, params: any) => {
  switch (type) {
    case PageType.VisualizationDetail:
      return `${PageType.VisualizationDetail}: ${params.visualizationId}`
    case PageType.VisualizationSettings:
      return `${PageType.VisualizationSettings}: ${params.visualizationId}`
    case PageType.VisualizationObjectEditor:
      return `${PageType.VisualizationObjectEditor}: ${params.visualizationId}`
    default:
      return type
  }
}

export const RumRouteMonitoring = () => {
  const location = useLocation()
  
  useEffect(() => {
    const matches = matchRoutes(Pages.getAll(), location.pathname)
    const matchedRoute = matches?.length ? matches[0] : undefined

    if (matchedRoute) {
      const name = getRouteName(matchedRoute.route.type, matchedRoute.params)
      datadogRum.startView({name})
    }
  
    if (matchedRoute?.params?.tenant) {
      datadogRum.setGlobalContextProperty('tenant', matchedRoute.params.tenant)
    }
  }, [location.pathname])


  return null
}
