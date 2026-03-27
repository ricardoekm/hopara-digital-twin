import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Title } from '@hopara/design-system/src/Title'
import { ErrorPanel } from '@hopara/design-system/src/error/ErrorPanel'
import { ActionButton, ActionButtonStatus } from '@hopara/design-system/src/buttons/ActionButton'
import { AuthContext } from '../../contexts/AuthContext'
import { useQuery } from '../../hooks/AuthHooks'
import { i18n } from '@hopara/i18n'
import {SimpleLayout} from '@hopara/design-system/src/layout/SimpleLayout'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import { Logger } from '@hopara/internals'

const ConfirmationPending: React.FunctionComponent = () => {
  const [error, setError] = React.useState('')
  const [sending, setSending] = React.useState(false)
  const authContext = useContext(AuthContext)
  const [emailSent, setEmailSent] = React.useState(false)
  const navigate = useNavigate()
  const query = useQuery()

  const email = query.get('email')
  if (!email) {
    navigate('/auth')
    return <></>
  }

  async function resendConfirmationClicked() {
    setSending(true)
    try {
      await authContext.authService.resendConfirmationEmail(email as string)
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
      <div data-testid="post-action-message">{
        i18n('EMAIL_SENT') + ' ' +
        i18n('GO_TO_YOUR_INBOX_AND_CLICK_ON_THE_LINK_THAT_WE_SENT_YOU')
        }
      </div>
    </>
  )

  const isNotConfirmedBlock = (
    <>
      <ErrorPanel error={error} />
      <div data-testid="send-it-again-message">
       {i18n('CANT_FIND_THE_EMAIL_SEND_IT_AGAIN')}
      </div>
      <ActionButton
        type="submit"
        variant="outlined"
        status={sending ? ActionButtonStatus.LOADING : undefined}
        label={i18n('RESEND_EMAIL')}
        loadingLabel={i18n('SENDING_ELLIPSIS')}
      />
    </>
  )
  return <SimpleLayout
    symbol={<Icon icon="email-sent" size="xl" />}
    onSymbolClick={() => cancelClicked()}
    title={<Title>{i18n('YOUR_EMAIL_IS_STILL_NOT_CONFIRMED')}</Title>}
    onSubmit={resendConfirmationClicked}
    content={
      <>
        <div data-testid="message">
          {i18n('GO_TO_YOUR_INBOX_AND_CLICK_ON_THE_LINK_THAT_WE_SENT_YOU')}
        </div>
        {emailSent ? emailSentBlock : isNotConfirmedBlock}
      </>
    }
  />
}

export default ConfirmationPending
