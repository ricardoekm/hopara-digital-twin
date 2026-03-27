import React, {useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useQuery, useValidPassword} from '../../hooks/AuthHooks'
import {AuthContext} from '../../contexts/AuthContext'
import {PasswordField} from '@hopara/design-system/src/PasswordField'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import {ActionButton, ActionButtonStatus} from '@hopara/design-system/src/buttons/ActionButton'
import {Title} from '@hopara/design-system/src/Title'
import {TextField} from '@hopara/design-system/src/form/TextField'
import {i18n} from '@hopara/i18n'
import {SimpleLayout} from '@hopara/design-system/src/layout/SimpleLayout'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {ChangePasswordInfo} from '../../components/ChangePasswordInfo'
import { Logger } from '@hopara/internals'

const ResetPasswordFromForgot: React.FunctionComponent = () => {
  const {password, setPassword, passwordValid, passwordError} = useValidPassword('')
  const [error, setError] = useState('')
  const [resetting, setResetting] = useState(false)
  const [didReset, setDidReset] = useState(false)
  const query = useQuery()
  const code = query.get('code')
  const email = query.get('email')
  const navigate = useNavigate()

  const valid = passwordValid && password.length > 0

  const authContext = useContext(AuthContext)

  if (!code || !email) {
    navigate('/auth')
    return <></>
  }

  const resetPasswordClicked = async () => {
    setResetting(true)
    try {
      await authContext.authService.resetPasswordFromForgot(email, code, password)
      setDidReset(true)
    } catch (err: any) {
      Logger.error(err)
      setError(err.message)
    }
    setResetting(false)
  }

  const continueToHoparaClick = () => {
    navigate('/')
  }

  const passwordResetPanel = (
    <>
      <ErrorPanel error={error}/>
      <ActionButton
        type="submit"
        valid={valid}
        status={resetting ? ActionButtonStatus.LOADING : undefined}
        label={i18n('RESET_PASSWORD')}
        loadingLabel={i18n('RESETTING_ELLIPSIS')}
      />
    </>
  )

  const passwordDidResetPanel = (
    <>
      <div data-testid="message">{i18n('YOUR_PASSWORD_HAS_BEEN_RESET')}</div>
      <ActionButton onClick={continueToHoparaClick} label={i18n('CONTINUE_TO_HOPARA')}/>
    </>
  )

  const cancelClicked = () => {
    navigate('/auth')
  }

  return (
    <SimpleLayout
      symbol={<Icon icon="key" size="xl"/>}
      onSymbolClick={() => cancelClicked()}
      title={<Title>{i18n('NEW_PASSWORD')}</Title>}
      content={
        <>
          <TextField disabled fullWidth placeholder={i18n('EMAIL')} value={email}/>
          {!didReset && <>
            <PasswordField
              placeholder={i18n('NEW_PASSWORD')}
              passwordValid={passwordValid}
              setPassword={setPassword}
              autoComplete="new-password"
              error={passwordError}
            />
            <ChangePasswordInfo/>
          </>
          }
          {didReset ? passwordDidResetPanel : passwordResetPanel}
        </>
      }
      onSubmit={resetPasswordClicked}
    />
  )
}

export default ResetPasswordFromForgot
