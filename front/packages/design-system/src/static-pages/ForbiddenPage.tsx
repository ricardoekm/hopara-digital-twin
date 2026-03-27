import React from 'react'
import {SimpleLayout} from '../layout/SimpleLayout'
import {Title} from '../Title'
import {i18n} from '@hopara/i18n'
import {Icon} from '../icons/Icon'
import SimpleButton from '../buttons/SimpleButton'

export const ForbiddenPage = () => {
  return (
    <SimpleLayout
      symbol={<Icon icon="padlock" size="xl" />}
      title={<Title>{i18n('YOU_DO_NOT_HAVE_PERMISSION_TO_ACCESS_THIS_PAGE')}</Title>}
      content={<SimpleButton onClick={() => window.location.assign('/')}>{i18n('GO_TO_INITIAL_PAGE')}</SimpleButton>}
    />
  )
}

export default ForbiddenPage
