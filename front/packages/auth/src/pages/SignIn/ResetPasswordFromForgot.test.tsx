import React from 'react'
import {render, screen, waitFor, fireEvent, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import {AuthContext} from '../../contexts/AuthContext'
import ResetPasswordFromForgot from './ResetPasswordFromForgot'
import {i18n, i18nWithNoBreaks} from '@hopara/i18n'
import {provideTheme} from '@hopara/design-system/src/provide-theme'

jest.mock('axios-retry', () => jest.fn())

const mockLocation = {
  search: 'email=any@email.com&code=any-code',
}

const mockNavigateFn = jest.fn()
// eslint-disable-next-line no-console
console.error = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
  useLocation: () => (mockLocation),
  useNavigationType: jest.fn(),
}))

function renderResetPassword(authService?: any) {
  const authContext = {
    authService: authService ?? {},
  }
  authContext.authService.resetPasswordFromForgot = authService?.resetPasswordFromForgot ?? (async () => undefined)
  render(
    provideTheme(
    <AuthContext.Provider value={authContext as any}>
      <ResetPasswordFromForgot/>
    </AuthContext.Provider>,
    ),
  )
}

describe('Page: Reset Password From Forgot', () => {
  it('should redirect to / if email is not provided', async () => {
    const bkpLocation = mockLocation.search
    mockLocation.search = 'code=any-code'
    renderResetPassword()
    expect(mockNavigateFn).toHaveBeenCalledWith('/auth')
    mockLocation.search = bkpLocation
  })

  it('should redirect to / if code is not provided', async () => {
    const bkpLocation = mockLocation.search
    mockLocation.search = 'email=any@email.com'
    renderResetPassword()
    expect(mockNavigateFn).toHaveBeenCalledWith('/auth')
    mockLocation.search = bkpLocation
  })

  it('should start empty', async () => {
    renderResetPassword()
    expect(screen.getByPlaceholderText(i18n('NEW_PASSWORD'))).toHaveValue('')
    expect(screen.getByPlaceholderText(i18n('EMAIL'))).toHaveValue('any@email.com')
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.getByTestId('reset-password-button')).toBeDisabled()
  })

  it('should enable reset password button if password is filled', () => {
    renderResetPassword()
    const password = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: 'aaaaaaaaaa'}})
    expect(screen.getByTestId('reset-password-button')).not.toBeDisabled()
  })

  it('should show resetting button when reset button is clicked', async () => {
    renderResetPassword()
    const password = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: 'any-password'}})
    act(() => {
      userEvent.click(screen.getByTestId('reset-password-button'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('resetting-button')).toBeDisabled()
    })
  })

  it('should show success message if password is reset', async () => {
    renderResetPassword()
    const password = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: 'any-password'}})
    act(() => {
      userEvent.click(screen.getByTestId('reset-password-button'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent(
        i18nWithNoBreaks('YOUR_PASSWORD_HAS_BEEN_RESET'),
      )
    })
    act(() => {
      userEvent.click(screen.getByTestId('continue-to-hopara-button'))
    })
    await waitFor(() => {
      expect(mockNavigateFn).toHaveBeenCalledWith('/')
    })
  })

  it('should show error if something goes wrong', async () => {
    renderResetPassword({
      resetPasswordFromForgot: async () => {
        throw new Error('any-error')
      },
    })
    const password = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: 'any-password'}})
    act(() => {
      userEvent.click(screen.getByTestId('reset-password-button'))
    })
    await waitFor(() => expect(screen.getByTestId('error')).toHaveTextContent('any-error'))
  })
})
