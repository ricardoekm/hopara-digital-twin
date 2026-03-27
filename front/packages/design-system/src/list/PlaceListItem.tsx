import React from 'react'
import {ObjectListItem, listItemImageSx, Props as ItemProps} from './ObjectListItem'
import {RowPlaceCard} from '../buttons/RowPlace/RowPlaceCard'
import {Box} from '@mui/material'
import { PureComponent } from '../component/PureComponent'
import {Theme, withTheme} from '../theme'

type Props = ItemProps & {
  onPlace?: Function
  placingIcon?: React.ReactNode
  getIcon: (placing: boolean) => React.ReactNode
  containerId?: string
  id: string
  canPlace?: boolean
  cantPlaceReason?: string
  isPlaced?: boolean
  isPlacing?: boolean
  isImage: boolean
  isSaving?: boolean
  onPlaceClickMobile?: () => void
  theme?: Theme
  isMobile?: boolean
  highlighted?: boolean
}

class PlaceListItemComp extends PureComponent<Props> {
  listItemRef: React.RefObject<HTMLLIElement> = React.createRef()

  render() {
    const highlightSx = this.props.highlighted ? {
      'backgroundColor': this.props.theme!.palette.spec.primaryContainer,
      'borderBottom': `1px solid ${this.props.theme!.palette.primary.main}33 !important`, // 20% opacity
      '&:hover': {
        backgroundColor: `color-mix(in srgb, ${this.props.theme!.palette.primary.main} 15%, ${this.props.theme!.palette.spec.primaryContainer})`,
      }
    } : {}

    return (
      <ObjectListItem
        {...this.props}
        containerRef={this.listItemRef}
        sx={{
          ...this.props.sx,
          ...highlightSx,
          '&:last-of-type': {
            [this.props.theme!.breakpoints.up('sm')]: {
              borderBottom: 'none',
            },
          },
        }}
        image={
          <Box sx={listItemImageSx}>
            <RowPlaceCard
              isMobile={this.props.isMobile}
              isImage={this.props.isImage}
              id={this.props.id}
              containerId={this.props.containerId}
              dragContainerRef={this.listItemRef}
              size="small"
              isPlaced={this.props.isPlaced ?? false}
              canPlace={this.props.canPlace ?? true}
              cantPlaceReason={this.props.cantPlaceReason}
              onPlace={this.props.onPlace}
              onClickMobile={this.props.onPlaceClickMobile}
              getIcon={this.props.getIcon}
              placingIcon={this.props.placingIcon}
              isSaving={this.props.isSaving}
            />
          </Box>
        }
      />
    )
  }
}

export const PlaceListItem = withTheme<Props>(PlaceListItemComp)
