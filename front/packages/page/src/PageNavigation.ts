import React, {useEffect, useState} from 'react'
import {Location, NavigateOptions as DomNavigateOptions, Params, useLocation, useNavigate, useParams, useNavigationType, NavigationType, generatePath} from 'react-router-dom'
import { PageType, Pages } from './Pages'
import { Config } from '@hopara/config'

export function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

export const getPageUrl = (type: PageType, tenant?: string, params?: Record<string, any>, options?: NavigateOptions) => {
  const page = Pages.getPage(type)
  const localParams = Object.assign({}, {tenant}, params)

  const unusedParams = new URLSearchParams()
  const pathParams = {}

  Object.entries(localParams).forEach(([key, value]) => {
    if (!value) return
    const hasInPath = new RegExp(`:${key}\\b`).test(page.path)
    if (hasInPath) pathParams[key] = value
    else if (Array.isArray(value)) value.forEach((v) => unusedParams.append(key, v))
    else unusedParams.append(key, value)
  })

  const path = generatePath(page.path, pathParams)
  const queryParams = unusedParams.toString()
  const search = queryParams ? `?${queryParams}` : ''

  if (options?.hard) return Config.getValue('BASE_URL') + path + search
  return path + search
}

export interface NavigateOptions extends DomNavigateOptions {
  hard?: boolean
  target?: React.HTMLAttributeAnchorTarget
}

export class PageNavigation {
  constructor(
    private navigateTo: ReturnType<typeof useNavigate>,
    private tenant: string,
    private routeParams: Params,
    private routeLocation: Location,
    private navigationType: NavigationType,
  ) {
  }

  getUrl(type: PageType, params?: Record<string, any>, options?: NavigateOptions) {
    return getPageUrl(type, this.tenant, params, options)
  }

  urlNavigate(url: string, options?: NavigateOptions) {
    if (options?.hard || options?.target) {
      window.open(url, options.target ?? '_self')
    } else {
      this.navigateTo(url, options)
    }
  }

  navigate(type: PageType, params?: Record<string, string | undefined>, options?: NavigateOptions) {
    const url = this.getUrl(type, params, options)
    this.urlNavigate(url, options)
  }

  getTitle(type: PageType) {
    return Pages.getTitle(type)
  }

  getPath(type: PageType) {
    return Pages.getPath(type)
  }

  getRouteParams(customParams = {}): Params {
    return {...this.routeParams, ...customParams}
  }

  getRouteState() {
    return this.routeLocation.state
  }

  getLocation(): Location {
    return this.routeLocation
  }

  getNavigationType(): NavigationType {
    return this.navigationType
  }
}

export const usePageNavigation = (tenant = '') => {
  const navigate = useNavigate()
  const location = useLocation()
  const navigationType = useNavigationType()
  const params = useParams()
  const query = useQuery()

  const [pageNavigation, setPageNavigation] = useState<PageNavigation>(
    new PageNavigation(navigate, tenant, {...Object.fromEntries(query), ...params}, location, navigationType),
  )

  useEffect(() => {
    setPageNavigation(new PageNavigation(
      navigate,
      tenant,
      {...Object.fromEntries(query), ...params},
      location,
      navigationType,
    ))
  }, [tenant, params, query, location, navigationType])

  return pageNavigation
}
