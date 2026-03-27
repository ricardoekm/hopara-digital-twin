import React from 'react'
import {DataSourceService} from './DataSourceService'
import {QueryService} from './QueryService'
import {DataFileService} from './DataFileService'
import { TenantService } from '../../tenant/TenantService'

const defaultState = {
  dataSourceService: new DataSourceService(),
  queryService: new QueryService(),
  dataFileService: new DataFileService(),
  tenantService: new TenantService()
}

export const DataSourceContext = React.createContext(defaultState)

export const DataSourceProvider = ({children}) => {
  const state = {
    dataSourceService: new DataSourceService(),
    queryService: new QueryService(),
    dataFileService: new DataFileService(),
    tenantService: new TenantService()
  }

  return <DataSourceContext.Provider value={state}>
    {children}
  </DataSourceContext.Provider>
}


