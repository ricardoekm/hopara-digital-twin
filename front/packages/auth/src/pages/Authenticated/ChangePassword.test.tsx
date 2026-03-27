import React from 'react'
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import {AuthContext} from '../../contexts/AuthContext'
import {i18n, i18nWithNoBreaks} from '@hopara/i18n'
import ChangePassword from './ChangePassword'
import {provideTheme} from '@hopara/design-system/src/provide-theme'

jest.mock('axios-retry', () => jest.fn())

const mockLocation = {
  search: 'email=any@email.com',
}

// eslint-disable-next-line no-console
console.error = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: () => (mockLocation),
  useNavigationType: jest.fn(),
  useParams: jest.fn(),
}))

function renderChangePassword(authService?: any) {
  const authContext = {
    authService: authService ?? {},
    authorization: {
      email: 'any-email',
    },
  }
  authContext.authService.changePassword = authService?.changePassword ?? (async () => undefined)
  render(
    provideTheme(
      <AuthContext.Provider value={authContext as any}>
        <ChangePassword/>
      </AuthContext.Provider>,
    ),
  )
}

describe('Page: Change Password', () => {
  it('should start showing empty password fields and disabled change button', async () => {
    renderChangePassword()
    expect(screen.getByPlaceholderText(i18n('CURRENT_PASSWORD'))).toHaveValue('')
    expect(screen.getByPlaceholderText(i18n('NEW_PASSWORD'))).toHaveValue('')
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.getByTestId('change-password-button')).toBeDisabled()
  })

  it('should keep change button disabled if current password is empty', () => {
    renderChangePassword()
    const password = screen.getByPlaceholderText(i18n('CURRENT_PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: ''}})
    expect(screen.getByTestId('change-password-button')).toBeDisabled()
  })

  it('should keep change button disabled if new password is empty', () => {
    renderChangePassword({})
    const password = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: ''}})
    expect(screen.getByTestId('change-password-button')).toBeDisabled()
  })

  it('should enable change button if passwords are filled', () => {
    renderChangePassword()
    const currentPassword = screen.getByPlaceholderText(i18n('CURRENT_PASSWORD')) as HTMLInputElement
    fireEvent.change(currentPassword, {target: {value: 'a'}})
    const newPassword = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(newPassword, {target: {value: 'aaaaaaaaaa'}})
    expect(screen.getByTestId('change-password-button')).not.toBeDisabled()
  })

  it('should show changing button when change button is clicked', async () => {
    renderChangePassword()
    const currentPassword = screen.getByPlaceholderText(i18n('CURRENT_PASSWORD')) as HTMLInputElement
    fireEvent.change(currentPassword, {target: {value: 'a'}})
    const newPassword = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(newPassword, {target: {value: 'aaaaaaaaaa'}})
    act(() => {
      userEvent.click(screen.getByTestId('change-password-button'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('changing-button')).toBeDisabled()
    })
  })

  it('should show error if change fails', async () => {
    renderChangePassword({
      changePassword: () => {
        throw new Error('any-error')
      },
    })
    const currentPassword = screen.getByPlaceholderText(i18n('CURRENT_PASSWORD')) as HTMLInputElement
    fireEvent.change(currentPassword, {target: {value: 'a'}})
    const newPassword = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(newPassword, {target: {value: 'aaaaaaaaaa'}})
    act(() => {
      userEvent.click(screen.getByTestId('change-password-button'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('change-password-button')).not.toBeDisabled()
    })
    expect(screen.getByTestId('error')).toHaveTextContent('any-error')
  })

  it('should show message "password changed" if change succeeds', async () => {
    renderChangePassword()

    const currentPassword = screen.getByPlaceholderText(i18n('CURRENT_PASSWORD')) as HTMLInputElement
    fireEvent.change(currentPassword, {target: {value: 'a'}})
    const newPassword = screen.getByPlaceholderText(i18n('NEW_PASSWORD')) as HTMLInputElement
    fireEvent.change(newPassword, {target: {value: 'aaaaaaaaaa'}})
    act(() => {
      userEvent.click(screen.getByTestId('change-password-button'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent(i18nWithNoBreaks('YOUR_PASSWORD_HAS_BEEN_CHANGED'))
    })
  })
})
