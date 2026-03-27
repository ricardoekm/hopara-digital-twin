import React from 'react'
import {act, configure, render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {provideTheme} from '@hopara/design-system/src/provide-theme'
import {DataSourceContext} from '../service/DataSourceContext'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import ViewDataSource from './ViewDataSource'
import {authorizationMock} from '@hopara/authorization/src/mocks'
import { i18n } from '@hopara/i18n'

const mockLocation = {
  search: 'email=any@email.com',
}

const mockRouteMatch: any = {params: {tenant: 'any-tenant', name: 'any-data-source'}}

// eslint-disable-next-line no-console
console.error = jest.fn()

configure((existingConfig) => ({
  ...existingConfig,
  defaultIgnore: 'script, style, svg, img, #mainSidebar',
}))

const mockNavigateFn = jest.fn()
const mockParams = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useMatch: () => mockRouteMatch,
  useNavigate: () => mockNavigateFn,
  useLocation: () => mockLocation,
  useParams: () => mockParams,
  useNavigationType: jest.fn(),
  Link: ({to, children}: {to: string, children: any}) => {
    return <a href={to}>{children}</a>
  },
}))

function renderPage(mocks?: any) {
  mocks = mocks ?? {}
  const authContext = {
    authorization: authorizationMock,
    getRefreshedAuthorization: () => authorizationMock
  }
  const dataSourceContext = {
    dataSourceService: {
      get: mocks.get ?? jest.fn(),
    },
    queryService: {
      list: mocks.queryList ?? jest.fn().mockResolvedValue([]),
    },
  }
  render(
    provideTheme(
      <AuthContext.Provider value={authContext as any}>
        <DataSourceContext.Provider value={dataSourceContext as any}>
          <ViewDataSource/>
        </DataSourceContext.Provider>
      </AuthContext.Provider>,
    ),
  )
}

describe('Page: View Data Source', () => {
  it('should start showing loading message', async () => {
    await act(async () => {
      renderPage()
    })
    expect(screen.queryByTestId('queriesError')).not.toBeInTheDocument()
  })

  it('should redirect to list data sources page if data source does not exist', async () => {
    const bkp = mockRouteMatch.params
    mockRouteMatch.params = {tenant: 'any-tenant'}
    await act(async () => {
      renderPage()
    })
    mockRouteMatch.params = bkp
    expect(mockNavigateFn).toHaveBeenCalledWith('/any-tenant/data-source', undefined)
  })

  it('should show error if query list fails', async () => {
    await act(async () => {
      renderPage({
        queryList: async () => {
          throw new Error('any-error')
        },
      })
    })
    expect(screen.queryByTestId('queriesError')).toHaveTextContent('any-error')
    expect(screen.queryByTestId('queriesLoading')).not.toBeInTheDocument()
  })

  it('should show query list after loading', async () => {
    await act(async () => {
      renderPage({
        get: async () => ({}),
        queryList: async () => ([{
          id: 'any-id',
          name: 'any-query',
          sql: 'any-sql',
          dataSource: 'any-data-source',
          other: 'any-other',
        }]),
      })
    })
    expect(screen.queryByTestId('queriesContent')).toHaveTextContent('any-query')
    expect(screen.queryByTestId('queriesLoading')).not.toBeInTheDocument()
  })

  it('should navigate to edit query when clicking on query', async () => {
    await act(async () => {
      renderPage({
        get: async () => ({
          name: 'any-data-source',
        }),
        queryList: async () => ([{
          id: 'any-id',
          name: 'any-query',
          sql: 'any-sql',
          dataSource: 'any-data-source',
          other: 'any-other',
        }]),
      })
    })
    expect(screen.queryByTestId('queriesContent')).toHaveTextContent('any-query')
  })

  it('should navigate to create query when click button', async () => {
    await act(async () => {
      renderPage({
        get: async () => ({
          name: 'any-data-source',
        }),
        queryList: async () => ([]),
      })
    })
    screen.getByTestId(`${i18n('NEW_QUERY')}-button`).click()
    expect(mockNavigateFn).toHaveBeenCalledWith('/any-tenant/data-source/any-data-source/query/create', undefined)
  })
})
