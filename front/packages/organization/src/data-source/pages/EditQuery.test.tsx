import React from 'react'
import {act, fireEvent, render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {provideTheme} from '@hopara/design-system/src/provide-theme'
import {DataSourceContext} from '../service/DataSourceContext'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import EditQuery from './EditQuery'
import {Column, Columns, ColumnType} from '@hopara/dataset'
import {authorizationMock} from '@hopara/authorization/src/mocks'

const mockLocation = {
  search: 'email=any@email.com',
}

const mockRouteMatch = {
  params: {
    menuOption: 'data-source',
  } as any,
}

const mockNavigateFn = jest.fn()
const mockParams = jest.fn()
// eslint-disable-next-line no-console
console.error = jest.fn()

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

const mockSuccessToast = jest.fn()
const mockErrorToast = jest.fn()


jest.mock('react-toastify', () => {
  return {
    toast: {
      dismiss: () => jest.fn(),
      success: (...params) => mockSuccessToast(...params),
      error: (...params) => {
        return mockErrorToast(...params)
      },
    },
  }
})

function renderPage(queryService?: any) {
  const authContext = {
    authorization: authorizationMock,
    getRefreshedAuthorization: () => authorizationMock,
  }
  const dataSourceContext = {
    queryService: queryService ?? {
      get: jest.fn(),
    },
  }
  render(
    provideTheme(
      <AuthContext.Provider value={authContext as any}>
        <DataSourceContext.Provider value={dataSourceContext as any}>
          <EditQuery/>
        </DataSourceContext.Provider>
      </AuthContext.Provider>),
  )
}

describe('EditQuery', () => {
  describe('Page: Create Query', () => {
    it('should start showing form fields and buttons', async () => {
      mockRouteMatch.params.name = undefined
      await act(async () => renderPage())
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()
      expect(screen.getByTestId('name')).toHaveValue('')
      expect(screen.getByTestId('save-button')).toBeDisabled()
      expect(screen.getByTestId('run-button')).toBeDisabled()
    })
  })

  describe('Page: Edit Query', () => {
    it('should start showing loading', async () => {
      mockRouteMatch.params.name = 'any-name'
      await act(async () => renderPage({}))
      expect(screen.queryByTestId('loading')).toBeInTheDocument()
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    })

    it('should show filled form fields and buttons', async () => {
      mockRouteMatch.params.name = 'any-name'
      await act(async () => renderPage({
        get: jest.fn().mockResolvedValue({
          name: 'any-name',
          query: 'select * from anytable',
        }),
      }))
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(screen.getByTestId('edit-title')).toBeInTheDocument()
      expect(screen.getByTestId('save-button')).toBeEnabled()
      expect(screen.getByTestId('run-button')).toBeEnabled()
    })

    it('should save and show toast when save button is clicked', async () => {
      mockRouteMatch.params.name = 'any-name'
      const upsertMock = jest.fn()
      await act(async () => renderPage({
        get: jest.fn().mockResolvedValue({
          name: 'any-name',
          query: 'select * from anytable',
        }),
        upsert: upsertMock,
      }))
      expect(screen.getByTestId('edit-title')).toBeInTheDocument()
      await act(async () => {
        fireEvent.click(screen.getByTestId('save-button'))
      })

      expect(screen.queryByTestId('error')).not.toBeInTheDocument()
      expect(upsertMock).toHaveBeenCalledWith({
        name: 'any-name',
        query: 'select * from anytable',
        primaryKey: undefined,
        writeLevel: undefined,
        writeTable: undefined,
      }, authorizationMock)
    })

    it('should show error when save button is clicked and some error occurs', async () => {
      mockRouteMatch.params.name = 'any-name'
      await act(async () => renderPage({
        get: jest.fn().mockResolvedValue({
          name: 'any-name',
          query: 'select * from anytable',
        }),
        upsert: jest.fn().mockRejectedValue(new Error('any-error')),
      }))
      expect(screen.getByTestId('edit-title')).toBeInTheDocument()
      await act(async () => {
        fireEvent.click(screen.getByTestId('save-button'))
      })
      expect(screen.getByTestId('error')).toBeInTheDocument()
    })

    it('should run and show table', async () => {
      mockRouteMatch.params.name = 'any-name'
      await act(async () => renderPage({
        get: jest.fn().mockResolvedValue({
          name: 'any-name',
          query: 'select * from anytable',
        }),
        run: jest.fn().mockResolvedValue({
            columns: new Columns(new Column({name: 'any-columns', type: ColumnType.STRING})),
            rows: [{'any-column': 'any-name'}],
          },
        ),
      }))
      expect(screen.getByTestId('edit-title')).toBeInTheDocument()
      expect(screen.getByTestId('table')).toHaveTextContent('any-column')
      await act(async () => {
        fireEvent.click(screen.getByTestId('run-button'))
      })
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()
      expect(screen.getByTestId('table')).toHaveTextContent('any-column')
    })

    it('should show error if run query fails', async () => {
      mockRouteMatch.params.name = 'any-name'
      await act(async () => renderPage({
        get: jest.fn().mockResolvedValue({
          name: 'any-name',
          query: 'select * from anytable',
        }),
        upsert: jest.fn().mockRejectedValue(new Error('any-error')),
      }))
      expect(screen.getByTestId('edit-title')).toBeInTheDocument()
      await act(async () => {
        fireEvent.click(screen.getByTestId('run-button'))
      })
      expect(screen.getByTestId('error')).toBeInTheDocument()
    })
  })
})
