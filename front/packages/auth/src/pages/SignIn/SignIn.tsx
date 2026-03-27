import React, {useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useQuery} from '../../hooks/AuthHooks'
import {AuthContext} from '../../contexts/AuthContext'
import {PasswordField} from '@hopara/design-system/src/PasswordField'
import {Title} from '@hopara/design-system/src/Title'
import {TextField} from '@hopara/design-system/src/form/TextField'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import {ActionButton, ActionButtonStatus} from '@hopara/design-system/src/buttons/ActionButton'
import Button from '@mui/material/Button'
import {i18n} from '@hopara/i18n'
import {SimpleLayout} from '@hopara/design-system/src/layout/SimpleLayout'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {InputAdornment} from '@mui/material'
import {usePageNavigation} from '@hopara/page/src/PageNavigation'
import { Logger } from '@hopara/internals'

const SignIn: React.FunctionComponent = () => {
  const [signingIn, setSigningIn] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  const query = useQuery()
  const navigation = usePageNavigation()

  const email = query.get('email')
  if (!email) {
    navigate('/auth')
    return <></>
  }

  const valid = email?.length > 0 && password.length > 0 && !signingIn

  const signInClicked = async () => {
    try {
      setSigningIn(true)
      const callbackUrl = localStorage.getItem('callback_url') ?? '/'
      await authContext.authService.signIn(email, password)
      localStorage.removeItem('callback_url')
      navigation.urlNavigate(callbackUrl, {hard: true})
    } catch (err: any) {
      if (err.message === 'UserNotConfirmedException') {
        navigate('/auth/signup/confirmation-pending?email=' + encodeURIComponent(email))
      } else if (err.message === 'NewPasswordRequired') {
        navigate('/auth/signup/define-password?email=' + encodeURIComponent(email))
      } else {
        Logger.error(err)
        setError(err.message)
      }
    }
    setSigningIn(false)
  }

  const forgotPasswordClicked = async () => {
    navigate('/auth/signin/forgot-password?email=' + encodeURIComponent(email))
  }

  const cancelClicked = () => {
    navigate('/auth')
  }

  return (
    <SimpleLayout
      symbol={<Icon icon="padlock" size="xl"/>}
      onSymbolClick={() => cancelClicked()}
      title={<Title>{i18n('TYPE_YOUR_HOPARA_PASSWORD')}</Title>}
      content={
        <>
          <TextField
            data-dd-privacy="mask"
            fullWidth
            disabled
            value={email}
            InputProps={{
              endAdornment: <InputAdornment position="end" sx={{marginRight: -12}}>
                <Button onClick={cancelClicked} variant="text" data-testid="change-button">{i18n('CHANGE')}</Button>
              </InputAdornment>,
            }}
          />

          <PasswordField
            passwordValid={true}
            setPassword={setPassword}
            autoComplete="current-password"
            autoFocus
          />
          <Button
            onClick={forgotPasswordClicked}
            data-testid="forgot-password-button"
            variant="text"
            sx={{
              justifySelf: 'end',
              marginTop: '-0.25em',
            }}>
            {i18n('FORGOT_PASSWORD_QUESTION')}
          </Button>
          <ErrorPanel error={error}/>
          <ActionButton
            type="submit"
            valid={valid}
            status={signingIn ? ActionButtonStatus.LOADING : undefined}
            label={i18n('SIGN_IN')}
            loadingLabel={i18n('SIGNING_IN_ELLIPSIS')}
          />
        </>
      }
      onSubmit={signInClicked}
    />
  )
}

export default SignIn
