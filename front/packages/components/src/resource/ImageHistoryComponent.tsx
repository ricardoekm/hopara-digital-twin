import React from 'react'
import {ResourceHistoryComponent, ResourceHistoryProps} from './ResourceHistoryComponent'
import {i18n} from '@hopara/i18n'
import {PureComponent} from '@hopara/design-system/src/component/PureComponent'

export class ImageHistoryComponent<T> extends PureComponent<ResourceHistoryProps & T> {
  render() {
    return <ResourceHistoryComponent
      title={i18n('HISTORY')}
      emptyMessage={i18n('EMPTY_IMAGE_HISTORY')}
      {...this.props}
    />
  }
}
