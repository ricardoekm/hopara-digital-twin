/* eslint-disable no-throw-literal */
import React from 'react'
import {render, screen, waitFor, fireEvent, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import SignIn from './SignIn'
import {AuthContext} from '../../contexts/AuthContext'
import {i18n} from '@hopara/i18n'
import {provideTheme} from '@hopara/design-system/src/provide-theme'

jest.mock('axios-retry', () => jest.fn())

const mockLocation = {
  search: 'email=any@email.com',
}

const mockNavigate = {
  urlNavigate: jest.fn(),
}
// eslint-disable-next-line no-console
console.error = jest.fn()

const mockNavigateFn = jest.fn()
const mockParams = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
  useLocation: () => mockLocation,
  useParams: () => mockParams,
  useNavigationType: jest.fn(),
}))

jest.mock('@hopara/page/src/PageNavigation', () => ({
  usePageNavigation: () => mockNavigate,
}))

function renderSignIn(authService?: any) {
  const authContext = {
    authService: authService ?? {},
  }
  authContext.authService.signIn = authService?.signIn ?? (async () => undefined)
  render(
    provideTheme(
      <AuthContext.Provider value={authContext as any}>
        <SignIn/>
      </AuthContext.Provider>,
    ),
  )
}

describe('Page: Sign In', () => {
  it('should redirect to / if email is not provided', async () => {
    const bkpLocation = mockLocation.search
    mockLocation.search = ''
    renderSignIn({})
    expect(mockNavigateFn).toHaveBeenCalledWith('/auth')
    mockLocation.search = bkpLocation
  })

  it('should start showing empty password field and disabled sign-in button', async () => {
    renderSignIn({})
    expect(screen.getByPlaceholderText(i18n('PASSWORD'))).toHaveValue('')
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.getByTestId('sign-in-button')).toBeDisabled()
  })

  it('should enable sign-in button if password is filled', () => {
    renderSignIn({})
    const password = screen.getByPlaceholderText(i18n('PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: 'a'}})
    expect(screen.getByTestId('sign-in-button')).not.toBeDisabled()
  })

  it('should show signin-in button when sign-in button is clicked', async () => {
    renderSignIn({signIn: async () => 'any'})
    const password = screen.getByPlaceholderText(i18n('PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: 'any-password'}})
    act(() => {
      userEvent.click(screen.getByTestId('sign-in-button'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('signing-in-button')).toBeDisabled()
    })
  })

  it('should navigate to confirmation page if user is not confirmed', async () => {
    renderSignIn({
      signIn: async () => {
        throw {message: 'UserNotConfirmedException'}
      },
    })
    const password = screen.getByPlaceholderText(i18n('PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: 'any-password'}})
    act(() => {
      userEvent.click(screen.getByTestId('sign-in-button'))
    })
    await waitFor(() => expect(mockNavigateFn).toHaveBeenCalledWith(
      '/auth/signup/confirmation-pending?email=any%40email.com',
    ))
  })


  it('should show error if authentication fails', async () => {
    renderSignIn({
      signIn: async () => {
        throw new Error('any-error')
      },
    })
    const password = screen.getByPlaceholderText(i18n('PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: 'password'}})
    act(() => {
      userEvent.click(screen.getByTestId('sign-in-button'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('sign-in-button')).not.toBeDisabled()
    })
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('any-error')
    })
  })

  it('should redirect to / if authentication succeeds', async () => {
    renderSignIn()

    const password = screen.getByPlaceholderText(i18n('PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: 'any-password'}})
    act(() => {
      userEvent.click(screen.getByTestId('sign-in-button'))
    })
    await waitFor(() => expect(mockNavigate.urlNavigate).toHaveBeenCalledWith('/', {hard: true}))
  })

  it('should navigate to forgot password screen if click to this link', async () => {
    renderSignIn()
    act(() => {
      userEvent.click(screen.getByTestId('forgot-password-button'))
    })
    await waitFor(() => {
      expect(mockNavigateFn).toHaveBeenCalledWith('/auth/signin/forgot-password?email=any%40email.com')
    })
  })

  it('should navigate to auth home page if click change link', async () => {
    renderSignIn()
    act(() => {
      userEvent.click(screen.getByTestId('change-button'))
    })
    await waitFor(() => {
      expect(mockNavigateFn).toHaveBeenCalledWith('/auth')
    })
  })
})
