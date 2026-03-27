import React from 'react'

import {act, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import ConfirmationPending from './ConfirmationPending'
import {AuthContext} from '../../contexts/AuthContext'
import {i18n, i18nWithNoBreaks} from '@hopara/i18n'
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

function renderConfirmationPending(authService?: any) {
  const authContext = {
    authService: authService ?? {},
  }
  authContext.authService.resendConfirmationEmail = authService?.resendConfirmationEmail ?? (async () => undefined)
  render(
    provideTheme(
      <AuthContext.Provider value={authContext as any}>
        <ConfirmationPending/>
      </AuthContext.Provider>,
    ),
  )
}

describe('Page: Confirmation Pending', () => {
  it('should redirect to / if email is not provided', async () => {
    const bkpLocation = mockLocation.search
    mockLocation.search = ''
    renderConfirmationPending()
    expect(mockNavigateFn).toHaveBeenCalledWith('/auth')
    mockLocation.search = bkpLocation
  })

  it('should start showing a message and resend button', async () => {
    renderConfirmationPending()
    expect(screen.getByTestId('message')).toHaveTextContent(i18n('GO_TO_YOUR_INBOX_AND_CLICK_ON_THE_LINK_THAT_WE_SENT_YOU'))
    expect(screen.getByTestId('resend-email-button')).not.toBeDisabled()
  })

  it('should show sending button when resend button is clicked', async () => {
    renderConfirmationPending()
    act(() => {
      userEvent.click(screen.getByTestId('resend-email-button'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('sending-button')).toBeDisabled()
    })
  })

  it('should show error if resend fails', async () => {
    renderConfirmationPending({
      resendConfirmationEmail: () => {
        throw new Error('any-error')
      },
    })
    act(() => {
      userEvent.click(screen.getByTestId('resend-email-button'))
    })
    await waitFor(() => {
      expect(screen.getByTestId('resend-email-button')).not.toBeDisabled()
    })
    expect(screen.getByTestId('error')).toHaveTextContent('any-error')
  })

  it('should show message "check email" if registration succeeds', async () => {
    renderConfirmationPending()
    act(() => {
      userEvent.click(screen.getByTestId('resend-email-button'))
    })
    await waitFor(() => {
      expect(screen.queryByTestId('resend-email-button')).not.toBeInTheDocument()
    })
    await waitFor(() => {
      expect(screen.getByTestId('post-action-message')).toHaveTextContent(i18n('EMAIL_SENT') + ' ' + i18nWithNoBreaks('GO_TO_YOUR_INBOX_AND_CLICK_ON_THE_LINK_THAT_WE_SENT_YOU'))
    })
  })
})
