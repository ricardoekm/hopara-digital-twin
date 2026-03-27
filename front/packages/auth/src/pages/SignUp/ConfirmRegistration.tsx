import React, {useState, useContext, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {ActionButton} from '@hopara/design-system/src/buttons/ActionButton'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import {Title} from '@hopara/design-system/src/Title'
import {AuthContext} from '../../contexts/AuthContext'
import {useQuery} from '../../hooks/AuthHooks'
import {i18n} from '@hopara/i18n'
import {SimpleLayout} from '@hopara/design-system/src/layout/SimpleLayout'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import { Logger } from '@hopara/internals'

const ConfirmRegistration: React.FunctionComponent = () => {
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [confirming, setConfirming] = useState(false)
  const navigate = useNavigate()
  const authContext = useContext(AuthContext)
  const query = useQuery()
  const code = query.get('code')
  const email = query.get('email')

  useEffect(() => {
    if (!(code && email)) {
      navigate('/auth')
      return
    }
    setConfirming(true)
    authContext.authService.confirmRegistration(email, code)
      .then(() => setConfirmed(true))
      .catch((err) => {
        Logger.error(err)
        setError(err.message)
      })
      .finally(() => setConfirming(false))
  }, [authContext, code, email, history])

  if (!code || !email) {
    navigate('/auth')
    return <></>
  }

  const confirmAccountTitle = <Title>{i18n('ACCOUNT_CONFIRMATION')}</Title>

  const confirmAccountPanel = (
    <>
      {confirming && <div data-testid="message">{i18n('CONFIRMING_YOUR_ACCOUNT_ELLIPSIS')}</div>}
      <ErrorPanel error={error}/>
    </>
  )

  const continueToHoparaClicked = () => {
    navigate('/auth/signin?email=' + encodeURIComponent(email))
  }

  const accountConfirmedTitle = <Title>{i18n('ACCOUNT_CONFIRMED')}</Title>
  const accountConfirmedPanel = (
    <>
      <div data-testid="post-action-message">{i18n('ACCOUNT_CONFIRMED')}</div>
      <ErrorPanel error={error}/>
      <ActionButton
        variant="outlined"
        label={i18n('CONTINUE_TO_HOPARA')}
        onClick={continueToHoparaClicked}
      />
    </>
  )
  
  const cancelClicked = () => {
    navigate('/auth')
  }

  return (
    <SimpleLayout
      symbol={<Icon icon="success-outlined" size="xl"/>}
      onSymbolClick={() => cancelClicked()}
      title={confirmed ? accountConfirmedTitle : confirmAccountTitle}
      content={confirmed ? accountConfirmedPanel : confirmAccountPanel}
    />
  )
}

export default ConfirmRegistration
