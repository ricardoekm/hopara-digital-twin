import React from 'react'
import { Logger } from '@hopara/internals'
import {i18n} from '@hopara/i18n'
import { toastError } from '../toast/Toast'

export class PureComponent<P = {}, S = {}, SS = any> extends React.PureComponent<P, S, SS> {
  componentDidCatch(error) {
    toastError(i18n('SOMETING_WENT_WRONG'))
    Logger.error(error)
  }
}
