import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PasswordField } from '@hopara/design-system/src/PasswordField'
import { Title } from '@hopara/design-system/src/Title'
import { ErrorPanel } from '@hopara/design-system/src/error/ErrorPanel'
import { ActionButton, ActionButtonStatus } from '@hopara/design-system/src/buttons/ActionButton'
import { TextField } from '@hopara/design-system/src/form/TextField'
import { useQuery, useValidPassword } from '../../hooks/AuthHooks'
import { AuthContext } from '../../contexts/AuthContext'
import { i18n } from '@hopara/i18n'
import {SimpleLayout} from '@hopara/design-system/src/layout/SimpleLayout'
import { TermsAndPrivacy } from '../../components/TermsAndPrivacy'
import {ChangePasswordInfo} from '../../components/ChangePasswordInfo'
import { Logger } from '@hopara/internals'

const ResetPasswordFromInvite: React.FunctionComponent = () => {
  const [error, setError] = useState('')
  const [changed, setChanged] = useState(false)
  const [changing, setChanging] = useState(false)
  const [checked, setChecked] = useState(false)
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()
  const query = useQuery()
  const [temporaryPassword, setTemporaryPassword] = useState('')

  const email = query.get('email')

  const {
    password: newPassword,
    setPassword: setNewPassword,
    passwordValid: newPasswordValid,
    passwordError,
  } = useValidPassword('')


  if (!email) {
    navigate('/auth')
    return <></>
  }

  const continueToHoparaClicked = () => {
    navigate('/')
  }

  const valid = temporaryPassword.length > 0 && newPasswordValid && newPassword.length > 0 && checked

  const changePasswordClicked = async () => {
    setChanging(true)
    try {
      await authContext.authService.resetPasswordFromInvite(email, temporaryPassword, newPassword)
      setChanged(true)
    } catch (err: any) {
      Logger.error(err)
      setError(err.message)
    }
    setChanging(false)
  }

  const checkboxChanged = () => {
    setChecked(!checked)
  }

  const passwordChangeFields = (
    <>
      <TextField fullWidth placeholder={i18n('EMAIL')} value={email} />
      <PasswordField
        placeholder={i18n('TEMPORARY_PASSWORD')}
        passwordValid={true}
        setPassword={setTemporaryPassword}
      />
      <PasswordField
        placeholder={i18n('NEW_PASSWORD')}
        passwordValid={newPasswordValid}
        setPassword={setNewPassword}
        error={passwordError}
      />
      <ChangePasswordInfo />
      <TermsAndPrivacy
        checked={checked}
        checkboxChanged={checkboxChanged}
      />
    </>
  )

  const passwordChangePanel = (
    <>
      <ErrorPanel error={error} />
      <ActionButton
        type="submit"
        valid={valid}
        status={changing ? ActionButtonStatus.LOADING : undefined}
        label={i18n('RESET_PASSWORD')}
        loadingLabel={i18n('RESETTING_ELLIPSIS')}
      />
    </>
  )

  const passwordChangedPanel = (
    <>
      <div data-testid="message">{i18n('YOUR_PASSWORD_HAS_BEEN_RESET')}</div>
      <ActionButton
        onClick={continueToHoparaClicked}
        label={i18n('CONTINUE_TO_HOPARA')}
      />
    </>
  )

  return (
    <SimpleLayout
      title={<Title>{i18n('RESET_PASSWORD')}</Title>}
      onSubmit={changePasswordClicked}
      content={
        <>
          {!changed && passwordChangeFields}
          {changed ? passwordChangedPanel : passwordChangePanel}
        </>
      }
    />
  )
}

export default ResetPasswordFromInvite
