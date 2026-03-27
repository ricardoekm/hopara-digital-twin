import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {PasswordField} from '@hopara/design-system/src/PasswordField'
import {TextField} from '@hopara/design-system/src/form/TextField'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import {ActionButton, ActionButtonStatus} from '@hopara/design-system/src/buttons/ActionButton'
import {Title} from '@hopara/design-system/src/Title'
import {useQuery, useValidConfirmationPassword, useValidPassword} from '../../hooks/AuthHooks'
import {AuthContext} from '../../contexts/AuthContext'
import {i18n} from '@hopara/i18n'
import {SimpleLayout} from '@hopara/design-system/src/layout/SimpleLayout'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import Button from '@mui/material/Button'
import {TermsAndPrivacy} from '../../components/TermsAndPrivacy'
import {InputAdornment, Typography} from '@mui/material'
import {ChangePasswordInfo} from '../../components/ChangePasswordInfo'
import { Logger } from '@hopara/internals'

const SignUp: React.FunctionComponent = () => {
  const query = useQuery()
  const [error, setError] = useState('')
  const [signingUp, setSigningUp] = useState(false)
  const [checked, setChecked] = useState(false)
  const [validating, setValidating] = useState(query.get('validEmail') !== 'true')
  const [invalidEmailError, setInvalidEmailError] = useState('')

  const {password, setPassword, passwordValid, passwordError} = useValidPassword('')
  const {
    passwordConfirmValid,
    passwordConfirmationError,
    setPasswordConfirm,
    passwordConfirm,
  } = useValidConfirmationPassword(password, '')

  const navigate = useNavigate()

  const email = query.get('email')
  const authContext = useContext(AuthContext)

  
  useEffect(() => {
    if (!email) {
      return navigate('/auth')
    }

    if (!validating) return

    authContext.authService.getUserStatus(email)
      .then((userStatus) => {
        setValidating(false)
        if (userStatus.status === 'CONFIRMED') {
          navigate('/auth/signin?email=' + encodeURIComponent(email))
        } else if (userStatus.status === 'UNCONFIRMED') {
          navigate('/auth/signup/confirmation-pending?email=' + encodeURIComponent(email))
        } else if (userStatus.status === 'USER_IS_NOT_CORPORATE') {
          setInvalidEmailError(i18n('USE_A_WORK_EMAIL_ADDRESS'))
        }
      })
      .catch((err) => {
        Logger.error(err)
        setValidating(false)
        setError(err.message)
      })
  }, [email])

  if (!email) return null

  const valid =
    email.length > 0 &&
    passwordValid &&
    password.length > 0 &&
    passwordConfirmValid &&
    passwordConfirm.length > 0 &&
    password === passwordConfirm &&
    checked

  const signUpClicked = async () => {
    setSigningUp(true)
    try {
      await authContext.authService.signUp(email, password)
      navigate('/auth/signup/account-created')
    } catch (err: any) {
      Logger.error(err)
      if (err instanceof Error) {
        setError(err.message)
      }
    }
    setSigningUp(false)
  }

  const cancelClicked = () => {
    navigate('/auth')
  }

  const checkboxChanged = () => {
    setChecked(!checked)
  }


  return (
    <SimpleLayout
      symbol={<Icon icon="key" size="xl"/>}
      onSymbolClick={() => cancelClicked()}
      title={<Title>{i18n('CREATE_A_NEW_ACCOUNT')}</Title>}
      content={
        validating ? <Typography>{i18n('VALIDATING_YOU_EMAIL_ELLIPSIS')}</Typography> :
        <>
          <TextField
            data-dd-privacy="mask"
            disabled
            fullWidth
            value={email}
            InputProps={{
              endAdornment: <InputAdornment position="end" sx={{marginRight: -12}}>
                <Button onClick={cancelClicked} variant="text" data-testid="change-button">{i18n('CHANGE')}</Button>
              </InputAdornment>,
            }}
          />

          {invalidEmailError ? <ErrorPanel error={invalidEmailError}/> : <>
            <PasswordField
              passwordValid={passwordValid}
              setPassword={setPassword}
              autoComplete="new-password"
              autoFocus
              error={passwordError}
            />
            <PasswordField
              placeholder={i18n('CONFIRM_PASSWORD')}
              passwordValid={passwordConfirmValid}
              error={passwordConfirmationError}
              setPassword={setPasswordConfirm}
              autoComplete="new-password"
            />
            <ChangePasswordInfo/>
            <TermsAndPrivacy
              checked={checked}
              checkboxChanged={checkboxChanged}
            />
          </>}
          <ErrorPanel error={error}/>

          <ActionButton
            type="submit"
            status={signingUp ? ActionButtonStatus.LOADING : undefined}
            valid={valid}
            label={i18n('SIGN_UP')}
            loadingLabel={i18n('SIGNING_UP_ELLIPSIS')}
          />
        </>
      }
      onSubmit={signUpClicked}
    />
  )
}

export default SignUp
