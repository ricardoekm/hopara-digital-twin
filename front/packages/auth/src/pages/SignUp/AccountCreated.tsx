import React from 'react'
import {useNavigate} from 'react-router-dom'
import {Title} from '@hopara/design-system/src/Title'
import {i18n} from '@hopara/i18n'
import {SimpleLayout} from '@hopara/design-system/src/layout/SimpleLayout'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {Info} from '@hopara/design-system/src/empty/Info'

const AccountCreated: React.FunctionComponent = () => {
  const navigate = useNavigate()

  const cancelClicked = () => {
    navigate('/auth')
  }

  return (
    <SimpleLayout
      symbol={<Icon icon="success-outlined" size="xl"/>}
      onSymbolClick={() => cancelClicked()}
      title={<Title>{i18n('ACCOUNT_CREATED')}</Title>}
      content={<>
        <div data-testid="message">
          {i18n('GO_TO_YOUR_INBOX_AND_CLICK_ON_THE_LINK_THAT_WE_SENT_YOU')}
        </div>
        <Info description={i18n('IT_MAY_TAKE_A_FEW_MINUTES_FOR_THE_EMAIL_TO_ARRIVE_AND_DONT_FORGET_TO_CHECK_YOUR_SPAM_FOLDER')} />
      </>
      }
    />
  )
}

export default AccountCreated
