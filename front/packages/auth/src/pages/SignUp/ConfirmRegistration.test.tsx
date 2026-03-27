import React from 'react'
import {act, render, screen, waitFor, waitForElementToBeRemoved} from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import {AuthContext} from '../../contexts/AuthContext'
import ConfirmRegistration from './ConfirmRegistration'
import {i18n} from '@hopara/i18n'
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

function renderConfirmRegistration(authService?: any) {
  const authContext = {
    authService: authService ?? {},
  }
  authContext.authService.confirmRegistration = authService?.confirmRegistration ?? (async () => undefined)
  render(
    provideTheme(
      <AuthContext.Provider value={authContext as any}>
        <ConfirmRegistration/>
      </AuthContext.Provider>,
    ),
  )
}

describe('Page: Confirm Registration', () => {
  it('should redirect to / if email is not provided', async () => {
    const bkpLocation = mockLocation.search
    mockLocation.search = 'code=any-code'
    renderConfirmRegistration({})
    expect(mockNavigateFn).toHaveBeenCalledWith('/auth')
    mockLocation.search = bkpLocation
  })

  it('should redirect to / if code is not provided', async () => {
    const bkpLocation = mockLocation.search
    mockLocation.search = 'email=any@email.com'
    renderConfirmRegistration({})
    expect(mockNavigateFn).toHaveBeenCalledWith('/auth')
    mockLocation.search = bkpLocation
  })

  it('should start showing confirming account message', async () => {
    renderConfirmRegistration()
    await screen.findByTestId('message')
    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent(i18n('CONFIRMING_YOUR_ACCOUNT_ELLIPSIS'))
    })
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
  })


  it('should show error if confirm account fails', async () => {
    renderConfirmRegistration({
      confirmRegistration: async () => {
        throw new Error('any-error')
      },
    })
    expect(await screen.findByTestId('error')).toHaveTextContent('any-error')
  })

  it('should show message "account confirmed" if confirmation succeeds', async () => {
    renderConfirmRegistration()
    await waitForElementToBeRemoved(() => screen.queryByTestId('message'))
    await waitFor(() => {
      expect(screen.getByTestId('post-action-message')).toHaveTextContent(i18n('ACCOUNT_CONFIRMED'))
    })
  })

  it('should navigate to / if confirmation succeeds and continue click', async () => {
    renderConfirmRegistration()
    await waitForElementToBeRemoved(() => screen.queryByTestId('message'))
    act(() => {
      userEvent.click(screen.getByTestId('continue-to-hopara-button'))
    })
    await waitFor(() => {
      expect(mockNavigateFn).toHaveBeenCalledWith('/auth/signin?email=any%40email.com')
    })
  })
})
