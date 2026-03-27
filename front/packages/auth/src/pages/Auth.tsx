import React, {useContext, useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'
import {useValidEmail} from '../hooks/AuthHooks'
import {AuthContext} from '../contexts/AuthContext'
import {EmailField} from '@hopara/design-system/src/EmailField'
import {Title} from '@hopara/design-system/src/Title'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import {ActionButton, ActionButtonStatus} from '@hopara/design-system/src/buttons/ActionButton'
import {i18n} from '@hopara/i18n'
import {SimpleLayout} from '@hopara/design-system/src/layout/SimpleLayout'
import {asyncTimeout} from '../libs/Timeout'
import {Logo} from '@hopara/design-system/src/branding/Logo'
import {usePageNavigation} from '@hopara/page/src/PageNavigation'
import { Logger } from '@hopara/internals'

const Auth: React.FunctionComponent = () => {
  const [status, setStatus] = useState<ActionButtonStatus | undefined>(undefined)
  const {email, setEmail, emailValid} = useValidEmail('')
  const [error, setError] = useState('')
  const [invalidEmailError, setInvalidEmailError] = useState('')
  const location = useLocation()
  const authContext = useContext(AuthContext)
  const pageNavigation = usePageNavigation()

  const valid = emailValid && email.length > 0

  const continueClicked = async () => {
    try {
      if (!valid) {
        return setInvalidEmailError(i18n('ENTER_A_VALID_EMAIL'))
      }
      setStatus(ActionButtonStatus.LOADING)
      const userStatus = await authContext.authService.getUserStatus(email)

      let redirectPath: string | undefined = undefined
      let hard = false
      if (userStatus.status === 'CONFIRMED') {
        redirectPath = '/auth/signin?email=' + encodeURIComponent(email)
      } else if (userStatus.status === 'DOES_NOT_EXIST') {
        redirectPath = '/auth/signup?email=' + encodeURIComponent(email) + '&validEmail=true'
      } else if (userStatus.status === 'UNCONFIRMED') {
        redirectPath = '/auth/signup/confirmation-pending?email=' + encodeURIComponent(email)
      } else if (userStatus.status === 'USER_IS_NOT_CORPORATE') {
        setInvalidEmailError(i18n('USE_A_WORK_EMAIL_ADDRESS'))
      } else if (userStatus.status === 'SAML') {
        redirectPath = userStatus.data?.signInUrl
        if (userStatus.data?.signOutUrl) localStorage.setItem('samlSignOutUrl', userStatus.data?.signOutUrl)
        hard = true
      }

      if (redirectPath) {
        setStatus(ActionButtonStatus.LOADED)
        await asyncTimeout(500)
        pageNavigation.urlNavigate(redirectPath, {hard})
      }
    } catch (err: any) {
      Logger.error(err)
      setError(err.message)
    }
    setStatus(undefined)
  }

  const inputRef = React.useRef<HTMLInputElement>()
  const shouldFocus = !!location?.state?.from
  useEffect(() => {
    if (shouldFocus) inputRef.current?.focus()
  }, [inputRef, shouldFocus])

  return (
      <SimpleLayout
        symbol={<Logo/>}
        title={<Title>{i18n('CONTINUE_WITH_YOUR_WORK_EMAIL')}</Title>}
        content={
          <>
            <EmailField
              setEmail={(email) => {
                setEmail(email)
                setInvalidEmailError('')
              }}
              inputRef={inputRef}
              autoComplete="username"
              error={!!invalidEmailError}
              errorMessage={invalidEmailError || undefined}
              />
            <ErrorPanel error={error ? i18n('AN_ERROR_OCCURRED') + ': ' + error : undefined}/>
            <ActionButton
              type="submit"
              status={status}
              label={i18n('CONTINUE')}
              loadingLabel={i18n('VERIFYING_ELLIPSIS')}
            />
          </>
        }
        onSubmit={continueClicked}
      />
  )
}

export default Auth
