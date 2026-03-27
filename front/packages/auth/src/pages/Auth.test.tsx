 
import React from 'react'
import {act, fireEvent, render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {AuthContext} from '../contexts/AuthContext'
import Auth from './Auth'
import {i18n} from '@hopara/i18n'
import {provideTheme} from '@hopara/design-system/src/provide-theme'
import {labelToTestId} from '@hopara/design-system/src/test/TestTools'
import {asyncTimeout} from '../libs/Timeout'

jest.mock('axios-retry', () => jest.fn())

const mockLocation = {
  search: 'email=any@email.com',
}

const mockNavigateFn = jest.fn()

// eslint-disable-next-line no-console
console.error = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
  useLocation: () => (mockLocation),
  useNavigationType: jest.fn(),
  useParams: jest.fn(),
  usePageNavigation: () => ({
    aaa: 111,
    urlNavigate: mockNavigateFn,
  }),
}))

function renderAuthPage(authService?: any) {
  const authContext = {
    authService: authService ?? {},
  }
  authContext.authService.getUserStatus = authService?.getUserStatus ?? (async () => true)
  render(
    provideTheme(
      <AuthContext.Provider value={authContext as any}>
        <Auth/>
      </AuthContext.Provider>,
    ),
  )
}

describe('Page: Auth', () => {
  it('should start showing empty email field', async () => {
    await act(async () => {
      renderAuthPage()
    })
    expect(screen.getByPlaceholderText(i18n('EMAIL'))).toHaveValue('')
  })

  it('should navigate to signIn page if continue button is clicked and user exists', async () => {
    await act(async () => {
      renderAuthPage({
        getUserStatus: async () => ({status: 'CONFIRMED'}),
      })
    })
    await act(async () => {
      const email = screen.getByPlaceholderText(i18n('EMAIL')) as HTMLInputElement
      fireEvent.change(email, {target: {value: 'existent@user.com'}})
    })
    await act(async () => {
      fireEvent.click(screen.getByTestId(`${labelToTestId(i18n('CONTINUE'))}-button`))
      await asyncTimeout(700)
    })
    expect(mockNavigateFn).toHaveBeenCalledWith(
      '/auth/signin?email=' + encodeURIComponent('existent@user.com'),
      {hard: false},
    )
  })

  it('should navigate to signUp page if continue button is clicked and user doest exist', async () => {
    await act(async () => {
      renderAuthPage({
        getUserStatus: async () => ({status: 'DOES_NOT_EXIST'}),
      })
    })
    await act(async () => {
      const email = screen.getByPlaceholderText(i18n('EMAIL')) as HTMLInputElement
      fireEvent.change(email, {target: {value: 'inexistent@user.com'}})
    })
    await act(async () => {
      fireEvent.click(screen.getByTestId(`${labelToTestId(i18n('CONTINUE'))}-button`))
      await asyncTimeout(700)
    })
    expect(mockNavigateFn).toHaveBeenCalledWith(
      '/auth/signup?email=' + encodeURIComponent('inexistent@user.com') + '&validEmail=true',
      {hard: false},
    )
  })

  it('should navigate to confirm page if continue button is clicked and user is not confirmed', async () => {
    await act(async () => {
      renderAuthPage({
        getUserStatus: async () => ({status: 'UNCONFIRMED'}),
      })
    })
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(i18n('EMAIL')), {target: {value: 'unconfirmed@user.com'}})
    })
    await act(async () => {
      fireEvent.click(screen.getByTestId(`${labelToTestId(i18n('CONTINUE'))}-button`))
      await asyncTimeout(700)
    })
    expect(mockNavigateFn).toHaveBeenCalledWith(
      '/auth/signup/confirmation-pending?email=unconfirmed%40user.com',
      {hard: false},
    )
  })

  it('should show error message if continue button is clicked and something went wrong', async () => {
    await act(async () => {
      renderAuthPage({
        getUserStatus: async () => {
          throw new Error('any-other-error')
        },
      })
    })
    await act(async () => {
      const email = screen.getByPlaceholderText(i18n('EMAIL')) as HTMLInputElement
      fireEvent.change(email, {target: {value: 'any@user.com'}})
    })
    await act(async () => {
      fireEvent.click(screen.getByTestId(`${labelToTestId(i18n('CONTINUE'))}-button`))
    })
    expect(screen.getByText(i18n('AN_ERROR_OCCURRED') + ': any-other-error')).toBeInTheDocument()
  })
})
