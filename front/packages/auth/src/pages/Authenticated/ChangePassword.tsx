import React, {useContext, useState} from 'react'

import {PasswordField} from '@hopara/design-system/src/PasswordField'
import {ActionButton, ActionButtonStatus} from '@hopara/design-system/src/buttons/ActionButton'
import {Title} from '@hopara/design-system/src/Title'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'

import {AuthContext} from '../../contexts/AuthContext'
import {useValidPassword} from '../../hooks/AuthHooks'
import {i18n} from '@hopara/i18n'
import {ChangePasswordInfo} from '../../components/ChangePasswordInfo'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {SimpleLayout} from '@hopara/design-system/src/layout/SimpleLayout'
import {Info} from '@hopara/design-system/src/empty/Info'
import {usePageNavigation} from '@hopara/page/src/PageNavigation'
import {PageType} from '@hopara/page/src/Pages'
import { Logger } from '@hopara/internals'

const ChangePassword: React.FunctionComponent = () => {
  const [error, setError] = useState('')
  const [changed, setChanged] = useState(false)
  const [changing, setChanging] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const authContext = useContext(AuthContext)
  const navigation = usePageNavigation(authContext.authorization.tenant)

  const {
    password: newPassword,
    setPassword: setNewPassword,
    passwordValid: newPasswordValid,
    passwordError,
  } = useValidPassword('')

  const valid = currentPassword.length > 0 &&
    newPasswordValid &&
    newPassword.length > 0

  const changePasswordClicked = async () => {
    setChanging(true)
    try {
      await authContext.authService.changePassword(authContext.authorization, currentPassword, newPassword)
      setChanged(true)
    } catch (err: any) {
      Logger.error(err)
      setError(err.message)
    }
    setChanging(false)
  }

  return <SimpleLayout
    symbol={<Icon icon="account" size="xl"/>}
    title={<Title>{authContext.authorization.email}</Title>}
    content={
      <>
        {!changed && <>
          <b>{i18n('CHANGE_PASSWORD')}</b>
          <PasswordField
            placeholder={i18n('CURRENT_PASSWORD')}
            passwordValid={true}
            setPassword={setCurrentPassword}
            autoComplete="new-password"
          />
          <PasswordField
            placeholder={i18n('NEW_PASSWORD')}
            passwordValid={newPasswordValid}
            setPassword={setNewPassword}
            autoComplete="new-password"
            error={passwordError}
          />
          <ChangePasswordInfo/>
          <ErrorPanel error={error}/>
          <ActionButton
            status={changing ? ActionButtonStatus.LOADING : undefined}
            valid={valid}
            label={i18n('CHANGE_PASSWORD')}
            loadingLabel={i18n('CHANGING_ELLIPSIS')}
            onClick={changePasswordClicked}
          />
        </>}
        {changed && <>
          <Info description={i18n('YOUR_PASSWORD_HAS_BEEN_CHANGED')} data-testid="message"/>
          <ActionButton onClick={() => {
            navigation.navigate(PageType.ListVisualizations)
          }} label={i18n('CONTINUE_TO_HOPARA')}/>
        </>}
      </>
    }
    onSubmit={() => undefined}
  />
}

export default ChangePassword
