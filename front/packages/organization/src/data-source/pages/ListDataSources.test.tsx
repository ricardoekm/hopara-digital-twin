import React from 'react'
import {act, configure, render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {DataSourceContext} from '../service/DataSourceContext'
import ListDataSources from './ListDataSources'
import {authorizationMock} from '@hopara/authorization/src/mocks'
import {Provider} from 'react-redux'
import {provideTheme} from '@hopara/design-system/src/provide-theme'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {configureStore} from '@reduxjs/toolkit'
import {reducer} from '@hopara/state'

const childReducers = {
  auth: () => ({authorization: {tenant: 'any'}}),
  spotlight: () => ({elementId: 'any'}),
}

function getStore(): any {
  return configureStore({
    reducer: reducer(childReducers),
  })
}

jest.mock('axios-retry', () => jest.fn())

configure((existingConfig) => ({
  ...existingConfig,
  defaultIgnore: 'script, style, svg, #mainSidebar',
}))

const mockLocation = {
  search: 'email=any@email.com',
}

const mockNavigateFn = jest.fn()
const mockParams = jest.fn()
// eslint-disable-next-line no-console
console.error = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useMatch: () => ({params: {menuOption: 'data-sources'}}),
  useNavigate: () => mockNavigateFn,
  useLocation: () => mockLocation,
  useParams: () => mockParams,
  useNavigationType: jest.fn(),
  Link: (props: { to: string, children: any }) => {
    return <a
      {...props}
      onClick={() => {
        mockNavigateFn(props.to)
      }}
      href={props.to}
    >
      {props.children}
    </a>
  },
}))

const mockPressConfirm = async (mockValue: boolean, callback) => {
  const confirmSpy = jest.spyOn(window, 'confirm')
  confirmSpy.mockImplementation(() => mockValue)
  try {
    await callback()
  } finally {
    confirmSpy.mockRestore()
  }
}

function renderPage(dataSourceService?: any) {
  const authContext = {
    authorization: authorizationMock,
    getRefreshedAuthorization: () => authorizationMock,
  }
  const dataSourceContext = {
    dataSourceService: dataSourceService ?? {
      list: jest.fn(),
    },
  }
  render(
    <Provider
      store={getStore()}
    >
      {
        provideTheme(
          <AuthContext.Provider value={authContext as any}>
            <DataSourceContext.Provider value={dataSourceContext as any}>
              <ListDataSources/>
            </DataSourceContext.Provider>
          </AuthContext.Provider>,
        )
      }
    </Provider>,
  )
}

describe('Page: List Data Sources', () => {
    it('should show a bunch of data sources after loading', async () => {
      await act(async () => {
        renderPage({
          list: async () => ([
            {name: 'any-datasource-1'},
            {name: 'any-datasource-2'},
          ]),
        })
      })
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()
      const dataSources = document.querySelectorAll('[data-test-id = "data-source"]')
      expect(dataSources).toHaveLength(2)
      expect(dataSources[0]).toHaveTextContent('any-datasource-1')
      expect(dataSources[1]).toHaveTextContent('any-datasource-2')
    })

    it('should navigate to new postgres when it is clicked', async () => {
      await act(async () => {
        renderPage({list: async () => ([])})
      })
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()
      const newPostgresButton = screen.getByTestId('postgres-button')
      newPostgresButton?.click()
      expect(mockNavigateFn).toHaveBeenCalledWith('/any-tenant/data-source/create?type=POSTGRES')
    })

    it('should navigate to new mysql when it is clicked', async () => {
      await act(async () => {
        renderPage({list: async () => ([])})
      })
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()
      const newMysqlButton = screen.getByTestId('mysql-button')
      newMysqlButton?.click()
      expect(mockNavigateFn).toHaveBeenCalledWith('/any-tenant/data-source/create?type=MYSQL')
    })

    it('should navigate to new singlestore when it is clicked', async () => {
      await act(async () => {
        renderPage({list: async () => ([])})
      })
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()
      const newSinglestoreButton = screen.getByTestId('singlestore-button')
      newSinglestoreButton?.click()
      expect(mockNavigateFn).toHaveBeenCalledWith('/any-tenant/data-source/create?type=SINGLESTORE')
    })

    it('should navigate to new timescale when it is clicked', async () => {
      await act(async () => {
        renderPage({list: async () => ([])})
      })
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()
      const newTimescaleButton = screen.getByTestId('timescale-button')
      newTimescaleButton?.click()
      expect(mockNavigateFn).toHaveBeenCalledWith('/any-tenant/data-source/create?type=TIMESCALE')
    })

    it('should navigate to edit data source when it is clicked', async () => {
      await act(async () => {
        renderPage({
          list: async () => ([
            {name: 'any-datasource'},
          ]),
        })
      })
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()

      act(() => {
        const menuButton = screen.getByTestId('card-menu-button')
        menuButton.click()
      })

      await act(async () => {
        const editButton = await screen.findByTestId('edit-button')
        editButton.click()
      })

      expect(mockNavigateFn).toHaveBeenCalledWith('/any-tenant/data-source/edit/any-datasource', undefined)
    })

    it('should navigate to view data source when it is clicked', async () => {
      await act(async () => {
        renderPage({
          list: async () => ([
            {name: 'any-datasource'},
          ]),
        })
      })
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()
      const viewButton = await screen.findByTestId('data-source')
      viewButton.click()
      expect(mockNavigateFn).toHaveBeenCalledWith('/any-tenant/data-source/any-datasource')
    })

    it('should delete data if delete button is clicked and confirm', async () => {
      const deleteMock = jest.fn()
      await act(async () => {
        renderPage({
          list: async () => ([
            {name: 'any-datasource'},
          ]),
          delete: deleteMock,
        })
      })

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()

      act(() => {
        const menuButton = screen.getByTestId('card-menu-button')
        menuButton.click()
      })

      await act(async () => {
        const deleteButton = await screen.findByTestId('delete-button')
        deleteButton.click()
      })

      await act(async () => {
        const deleteButton = await screen.findByTestId('confirm')
        deleteButton.click()
      })

      expect(deleteMock).toHaveBeenCalledWith('any-datasource', authorizationMock)
    })

    it('should not delete data if delete button is clicked and cancel', async () => {
      const deleteMock = jest.fn()
      await act(async () => {
        renderPage({
          list: async () => ([
            {name: 'any-datasource'},
          ]),
          delete: deleteMock,
        })
      })

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()

      act(() => {
        const menuButton = screen.getByTestId('card-menu-button')
        menuButton.click()
      })

      await act(async () => {
        const deleteButton = await screen.findByTestId('delete-button')
        await mockPressConfirm(false, () => {
          deleteButton.click()
        })
      })

      expect(deleteMock).not.toHaveBeenCalled()
    })

    it('should throw error if delete fails', async () => {
      await act(async () => {
        renderPage({
          list: async () => ([
            {name: 'any-datasource'},
          ]),
          delete: jest.fn().mockRejectedValue(new Error('any-error')),
        })
      })

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
      expect(screen.queryByTestId('error')).not.toBeInTheDocument()

      act(() => {
        const menuButton = screen.getByTestId('card-menu-button')
        menuButton.click()
      })

      await act(async () => {
        const deleteButton = await screen.findByTestId('delete-button')
        deleteButton.click()
      })

      await act(async () => {
        const confirmButton = await screen.findByTestId('confirm')
        confirmButton.click()
      })

      expect(await screen.findByTestId('error')).toHaveTextContent('any-error')
    })
  },
)
