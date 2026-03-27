import React from 'react'
import {PureComponent} from '../../component/PureComponent'
import {RowPlaceCardDraggable, Props as DraggableProps} from './cards/RowPlaceCardDraggable'
export {RowPlaceStatus} from './cards/RowPlaceCardDraggable'
import {RowPlaceCardMobile} from './cards/RowPlaceCardMobile'
import { withForwardedRef } from '../../component/withForwardedRef'

interface Props extends DraggableProps {
  onClickMobile: () => void
  isMobile: boolean
}

export class RowPlaceCardComp extends PureComponent<Props> {
  render(): React.ReactNode {
    if (this.props.isMobile) {
      return <RowPlaceCardMobile {...this.props} />
    }
    return <RowPlaceCardDraggable {...this.props} />
  }
}

export const RowPlaceCard = withForwardedRef(RowPlaceCardComp)
