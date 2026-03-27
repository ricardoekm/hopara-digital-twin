import React from 'react'
import {Info} from '@hopara/design-system/src/empty/Info'
import {i18n} from '@hopara/i18n'

export const ChangePasswordInfo = () => {
  return <Info
    description={i18n('YOUR_PASSWORD_SHOULD_CONTAIN_AT_LEAST_10_CHARS_LONG')}
  />
}
