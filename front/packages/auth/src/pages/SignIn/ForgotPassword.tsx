import React, {useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {AuthContext} from '../../contexts/AuthContext'
import {useQuery} from '../../hooks/AuthHooks'
import {i18n} from '@hopara/i18n'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import {Title} from '@hopara/design-system/src/Title'
import {ActionButton, ActionButtonStatus} from '@hopara/design-system/src/buttons/ActionButton'
import {Link} from '@hopara/design-system/src/Link'
import {SimpleLayout} from '@hopara/design-system/src/layout/SimpleLayout'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import Button from '@mui/material/Button'
import {TextField} from '@hopara/design-system/src/form/TextField'
import {InputAdornment} from '@mui/material'
import {Info} from '@hopara/design-system/src/empty/Info'
import { Logger } from '@hopara/internals'

const ForgotPassword: React.FunctionComponent = () => {
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [sending, setSending] = useState(false)
  const query = useQuery()
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)

  const email = query.get('email')
  if (!email) {
    navigate('/auth')
    return <></>
  }

  const valid = email.length > 0

  const sendEmailClicked = async () => {
    setSending(true)
    try {
      await authContext.authService.forgotPassword(email)
      setEmailSent(true)
    } catch (err: any) {
      Logger.error(err)
      setError(err.message)
    }
    setSending(false)
  }

  const cancelClicked = () => {
    navigate('/auth')
  }

  const emailSentBlock = (
    <>
      <div data-testid="message">
        {i18n('RESET_LINK_WAS_SENT_TO_EMAIL', {email})}
      </div>
      <Info description={i18n('IT_MAY_TAKE_A_FEW_MINUTES_FOR_THE_EMAIL_TO_ARRIVE_AND_DONT_FORGET_TO_CHECK_YOUR_SPAM_FOLDER')} />
      <Link onClick={cancelClicked}>{i18n('CONTINUE_TO_HOPARA')}</Link>
    </>
  )

  const sendEmailBlock = (
    <>
      <ErrorPanel error={error}/>
      <ActionButton
        type="submit"
        variant="outlined"
        valid={valid}
        status={sending ? ActionButtonStatus.LOADING : undefined}
        label={i18n('SEND_EMAIL')}
        loadingLabel={i18n('SENDING_ELLIPSIS')}
      />
    </>
  )

  return (
    <SimpleLayout
      symbol={<Icon icon="padlock" size="xl"/>}
      onSymbolClick={() => cancelClicked()}
      title={<Title>{i18n('RESET_PASSWORD')}</Title>}
      content={
        <>
          {!emailSent && <>
            <div data-testid="forgot-message">{i18n('FORGOT_PASSWORD_DESCRIPTION')}</div>
            <TextField
              disabled
              fullWidth
              placeholder={i18n('EMAIL')}
              value={email}
              InputProps={{
                endAdornment: <InputAdornment position="end" sx={{marginRight: -12}}>
                  <Button onClick={cancelClicked} variant="text" data-testid="change-button">{i18n('CHANGE')}</Button>
                </InputAdornment>,
              }}
            />
          </>}
          {emailSent ? emailSentBlock : sendEmailBlock}
        </>
      }
      onSubmit={sendEmailClicked}
    />
  )
}

export default ForgotPassword
