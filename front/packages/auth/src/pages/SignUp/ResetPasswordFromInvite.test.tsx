import React from 'react'
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import {AuthContext} from '../../contexts/AuthContext'
import {i18n, i18nWithNoBreaks} from '@hopara/i18n'
import ResetPasswordFromInvite from './ResetPasswordFromInvite'
import {provideTheme} from '@hopara/design-system/src/provide-theme'

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
}))

function renderResetPasswordFromInvite(authService?: any) {
  const authContext = {
    authService: authService ?? {},
  }
  authContext.authService.resetPasswordFromInvite = authService?.resetPasswordFromInvite ?? (async () => true)

  render(
    provideTheme(
      <AuthContext.Provider value={authContext as any}>
        <ResetPasswordFromInvite/>
      </AuthContext.Provider>,
    ),
  )
}

const termsAndPrivacy = 'I accept the Hopara Product Terms and Privacy Statement'

describe('Page: Reset Password From Invite', () => {
  it('should redirect to / if email is not provided', async () => {
    const bkpLocation = mockLocation.search
    mockLocation.search = ''
    renderResetPasswordFromInvite({})
    expect(mockNavigateFn).toHaveBeenCalledWith('/auth')
    mockLocation.search = bkpLocation
  })

  it('should start showing empty password fields and disabled reset button', async () => {
    renderResetPasswordFromInvite()
    expect(screen.getByPlaceholderText(i18n('EMAIL'))).toHaveValue('any@email.com')
    expect(screen.getByPlaceholderText(i18n('TEMPORARY_PASSWORD'))).toHaveValue('')
    expect(screen.getByPlaceholderText(i18n('NEW_PASSWORD'))).toHaveValue('')
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.getByTestId('reset-password-button')).toBeDisabled()
  })

  it('should keep reset button disabled temporary password is empty', () => {
    renderResetPasswordFromInvite()
    const password = screen.getByPlaceholderText(i18n('TEMPORARY_PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: ''}})
    expect(screen.getByTestId('reset-password-button')).toBeDisabled()
  })

  it('should keep reset button disabled new password is empty', () => {
    renderResetPasswordFromInvite({})
    const password = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: ''}})
    expect(screen.getByTestId('reset-password-button')).toBeDisabled()
  })

  it('should keep reset button disabled if user does not accept the terms', () => {
    renderResetPasswordFromInvite()
    const temporaryPassword = screen.getByPlaceholderText(i18n('TEMPORARY_PASSWORD')) as HTMLInputElement
    fireEvent.change(temporaryPassword, {target: {value: 'a'}})
    const newPassword = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(newPassword, {target: {value: 'a'}})
    expect(screen.getByTestId('reset-password-button')).toBeDisabled()
  })

  it('should enable reset button if passwords are filled', () => {
    renderResetPasswordFromInvite()
    const temporaryPassword = screen.getByPlaceholderText(i18n('TEMPORARY_PASSWORD')) as HTMLInputElement
    fireEvent.change(temporaryPassword, {target: {value: 'a'}})
    const newPassword = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(newPassword, {target: {value: 'aaaaaaaaaa'}})
    act(() => {
      userEvent.click(screen.getByLabelText(termsAndPrivacy))
    })
    expect(screen.getByTestId('reset-password-button')).not.toBeDisabled()
  })

  it('should show resetting button when reset button is clicked', async () => {
    renderResetPasswordFromInvite()
    const temporaryPassword = screen.getByPlaceholderText(i18n('TEMPORARY_PASSWORD')) as HTMLInputElement
    fireEvent.change(temporaryPassword, {target: {value: 'a'}})
    const newPassword = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(newPassword, {target: {value: 'aaaaaaaaaa'}})
    act(() => {
      userEvent.click(screen.getByLabelText(termsAndPrivacy))
      userEvent.click(screen.getByTestId('reset-password-button'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('resetting-button')).toBeDisabled()
    })
  })

  it('should show error if reset fails', async () => {
    renderResetPasswordFromInvite({
      resetPasswordFromInvite: () => {
        throw new Error('any-error')
      },
    })
    const temporaryPassword = screen.getByPlaceholderText(i18n('TEMPORARY_PASSWORD')) as HTMLInputElement
    fireEvent.change(temporaryPassword, {target: {value: 'a'}})
    const newPassword = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(newPassword, {target: {value: 'aaaaaaaaaaa'}})
    act(() => {
      userEvent.click(screen.getByLabelText(termsAndPrivacy))
      userEvent.click(screen.getByTestId('reset-password-button'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('reset-password-button')).not.toBeDisabled()
    })
    expect(screen.getByTestId('error')).toHaveTextContent('any-error')
  })

  it('should show message "password resetd" if reset succeeds', async () => {
    renderResetPasswordFromInvite()

    const temporaryPassword = screen.getByPlaceholderText(i18n('TEMPORARY_PASSWORD')) as HTMLInputElement
    fireEvent.change(temporaryPassword, {target: {value: 'a'}})
    const newPassword = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(newPassword, {target: {value: 'aaaaaaaaaaa'}})

    act(() => {
      userEvent.click(screen.getByLabelText(termsAndPrivacy))
      userEvent.click(screen.getByTestId('reset-password-button'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent(
        i18nWithNoBreaks('YOUR_PASSWORD_HAS_BEEN_RESET'),
      )
    })
  })

  it('should navigate to / if reset succeeds and click continue button', async () => {
    renderResetPasswordFromInvite()

    const temporaryPassword = screen.getByPlaceholderText(i18n('TEMPORARY_PASSWORD')) as HTMLInputElement
    fireEvent.change(temporaryPassword, {target: {value: 'a'}})
    const newPassword = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(newPassword, {target: {value: 'aaaaaaaaaa'}})

    await act(async () => {
      userEvent.click(screen.getByLabelText(termsAndPrivacy))
      userEvent.click(screen.getByTestId('reset-password-button'))
    })

    await act(async () => {
      userEvent.click(screen.getByTestId('continue-to-hopara-button'))
    })

    expect(mockNavigateFn).toHaveBeenCalledWith('/')
  })
})
