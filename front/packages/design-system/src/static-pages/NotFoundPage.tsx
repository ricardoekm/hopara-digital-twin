import React from 'react'
import {SimpleLayout} from '../layout/SimpleLayout'
import {Title} from '../Title'
import {i18n} from '@hopara/i18n'
import {Icon} from '../icons/Icon'
import SimpleButton from '../buttons/SimpleButton'
import { Config } from '@hopara/config'

export const NotFoundPage = () => {
  const showActinoButton = !Config.getValueAsBoolean('IS_EMBEDDED')
  return (
    <SimpleLayout
      symbol={<Icon icon="notfound" size="xxl" />}
      title={<Title>{i18n('THE_PAGE_YOU_ARE_TRYING_TO_ACCESS_CANNOT_BE_FOUND')}</Title>}
      content={showActinoButton ? <SimpleButton onClick={() => window.location.assign('/')}>{i18n('GO_TO_INITIAL_PAGE')}</SimpleButton> : null}
    />
  )
}

export default NotFoundPage
