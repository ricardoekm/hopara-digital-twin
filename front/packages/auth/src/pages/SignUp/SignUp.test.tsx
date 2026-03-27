import React from 'react'
import {render, screen, fireEvent, waitFor, configure, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import SignUp from './SignUp'
import {AuthContext} from '../../contexts/AuthContext'
import {i18n} from '@hopara/i18n'
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

configure((existingConfig) => ({
  ...existingConfig,
  defaultIgnore: 'script, style, svg, img, #mainSidebar',
}))


function renderSignUp(authService?: any) {
  const authContext = {
    authService: authService ?? {},
  }
  authContext.authService.signUp = authService?.signUp ?? (async () => undefined)
  authContext.authService.getUserStatus = authService?.getUserStatus ?? (async () => ({status: 'DOES_NOT_EXIST'}))

  render(
    provideTheme(
    <AuthContext.Provider value={authContext as any}>
      <SignUp/>
    </AuthContext.Provider>,
    ),
  )
}

const iacceptTheTermsAndPrivacy = 'I accept the Hopara Product Terms and Privacy Statement'

describe('Page: Sign Up', () => {
  it('should redirect to / if email is not provided', async () => {
    const bkpLocation = mockLocation.search
    mockLocation.search = ''
    await act(async () => renderSignUp())
    expect(mockNavigateFn).toHaveBeenCalledWith('/auth')
    mockLocation.search = bkpLocation
  })

  it('should start showing empty password fields and disabled sign-in button', async () => {
    await act(async () => renderSignUp())
    expect(screen.getByPlaceholderText(i18n('PASSWORD'))).toHaveValue('')
    expect(screen.getByPlaceholderText(i18n('CONFIRM_PASSWORD'))).toHaveValue('')
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.getByTestId('sign-up-button')).toBeDisabled()
  })

  it('should keep sign up button disabled if passwords are different', async () => {
    await act(async () => renderSignUp())
    const password = screen.getByPlaceholderText(i18n('PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: 'foo'}})
    const confirmPassword = screen.getByPlaceholderText(i18n('CONFIRM_PASSWORD')) as HTMLInputElement
    fireEvent.change(confirmPassword, {target: {value: 'bar'}})
    expect(screen.getByTestId('sign-up-button')).toBeDisabled()
  })

  it('should not enable sign-up button even if passwords are filled, have same content, but terms are not accepted', async () => {
    await act(async () => renderSignUp())
    const password = screen.getByPlaceholderText(i18n('PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: 'a'}})
    const confirmPassword = screen.getByPlaceholderText(i18n('CONFIRM_PASSWORD')) as HTMLInputElement
    fireEvent.change(confirmPassword, {target: {value: 'a'}})
    expect(screen.getByTestId('sign-up-button')).toBeDisabled()
  })

  it('should enable sign-up button if passwords are filled, have same content and terms are accepted', async () => {
    await act(async () => renderSignUp())
    const password = screen.getByPlaceholderText(i18n('PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: 'aaaaaaaaaa'}})
    const confirmPassword = screen.getByPlaceholderText(i18n('CONFIRM_PASSWORD')) as HTMLInputElement
    fireEvent.change(confirmPassword, {target: {value: 'aaaaaaaaaa'}})

    act(() => {
      userEvent.click(screen.getByLabelText(iacceptTheTermsAndPrivacy))
    })

    expect(screen.getByTestId('sign-up-button')).not.toBeDisabled()
  })

  it('should show signin-up button when sign-up button is clicked', async () => {
    await act(async () => renderSignUp())
    const password = screen.getByPlaceholderText(i18n('PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: 'any-password'}})
    const confirmPassword = screen.getByPlaceholderText(i18n('CONFIRM_PASSWORD')) as HTMLInputElement
    fireEvent.change(confirmPassword, {target: {value: 'any-password'}})

    act(() => {
      userEvent.click(screen.getByLabelText(iacceptTheTermsAndPrivacy))
      userEvent.click(screen.getByTestId('sign-up-button'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('signing-up-button')).toBeDisabled()
    })
  })

  it('should show error if sign-up fails', async () => {
    await act(async () => renderSignUp({
      signUp: async () => {
        throw new Error('any-error')
      },
    }))
    const password = screen.getByPlaceholderText(i18n('PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: 'any-password'}})
    const confirmPassword = screen.getByPlaceholderText(i18n('CONFIRM_PASSWORD')) as HTMLInputElement
    fireEvent.change(confirmPassword, {target: {value: 'any-password'}})

    act(() => {
      userEvent.click(screen.getByLabelText(iacceptTheTermsAndPrivacy))
      userEvent.click(screen.getByTestId('sign-up-button'))
    })

    await waitFor(() => {
      expect(screen.getByTestId('sign-up-button')).not.toBeDisabled()
    })
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('any-error')
    })
  })

  it('should show message "check email" if registration succeeds', async () => {
    await act(async () => renderSignUp())

    const password = screen.getByPlaceholderText(i18n('PASSWORD')) as HTMLInputElement
    fireEvent.change(password, {target: {value: 'any-password'}})
    const confirmPassword = screen.getByPlaceholderText(i18n('CONFIRM_PASSWORD')) as HTMLInputElement
    fireEvent.change(confirmPassword, {target: {value: 'any-password'}})

    act(() => {
      userEvent.click(screen.getByLabelText(iacceptTheTermsAndPrivacy))
      userEvent.click(screen.getByTestId('sign-up-button'))
    })

    await waitFor(() => {
      expect(mockNavigateFn).toHaveBeenCalledWith('/auth/signup/account-created')
    })
  })

  it('should navigate to auth home if click cancel link', async () => {
    await act(async () => renderSignUp())
    act(() => {
      userEvent.click(screen.getByTestId('change-button'))
    })
    expect(mockNavigateFn).toHaveBeenCalledWith('/auth')
  })
})
