import React from 'react'
import {act, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import {AuthContext} from '../../contexts/AuthContext'
import {i18n} from '@hopara/i18n'
import ForgotPassword from './ForgotPassword'
import {provideTheme} from '@hopara/design-system/src/provide-theme'

jest.mock('axios-retry', () => jest.fn())

const mockLocation = {
  search: 'email=any@email.com',
}

const mockNavigateFn = jest.fn()
const mockParams = jest.fn()

// eslint-disable-next-line no-console
console.error = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
  useLocation: () => (mockLocation),
  useParams: () => mockParams,
  useNavigationType: jest.fn(),
}))

function renderForgotPassword(authService?: any) {
  const authContext = {
    authService: authService ?? {},
  }
  authContext.authService.forgotPassword = authService?.forgotPassword ?? (async () => true)
  render(
    provideTheme(
      <AuthContext.Provider value={authContext as any}>
        <ForgotPassword/>
      </AuthContext.Provider>,
    ),
  )
}

describe('Page: Forgot Password', () => {
  it('should redirect to / if email is not provided', async () => {
    const bkpLocation = mockLocation.search
    mockLocation.search = ''
    renderForgotPassword()
    expect(mockNavigateFn).toHaveBeenCalledWith('/auth')
    mockLocation.search = bkpLocation
  })

  it('should start empty', async () => {
    renderForgotPassword()
    expect(screen.getByPlaceholderText(i18n('EMAIL'))).toHaveValue('any@email.com')
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.getByTestId('send-email-button')).not.toBeDisabled()
  })

  it('should show sending button when reset button is clicked', async () => {
    renderForgotPassword()
    act(() => {
      userEvent.click(screen.getByTestId('send-email-button'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('sending-button')).toBeDisabled()
    })
  })

  it('should show success message if reset link was sent', async () => {
    renderForgotPassword()
    act(() => {
      userEvent.click(screen.getByTestId('send-email-button'))
    })
    await waitFor(() =>
      expect(screen.getByTestId('message')).toHaveTextContent(
        i18n('RESET_LINK_WAS_SENT_TO_EMAIL', {email: 'any@email.com'}),
      ),
    )
  })

  it('should show error if something goes wrong', async () => {
    renderForgotPassword({
      forgotPassword: async () => {
        throw new Error('any-error')
      },
    })
    act(() => {
      userEvent.click(screen.getByTestId('send-email-button'))
    })
    await waitFor(() => expect(screen.getByTestId('error'))
      .toHaveTextContent('any-error'))
  })
})
