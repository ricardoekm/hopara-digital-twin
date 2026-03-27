import React from 'react'
import {Box, Skeleton, SxProps, Typography} from '@mui/material'
import {styled} from '../theme'
import {Icon} from '../icons/Icon'
import {PureComponent} from '../component/PureComponent'
import {ItemStyle} from './ListItem'

export interface Props {
  title?: string
  description?: string
  sx?: SxProps
  testId?: string
  onClick?: () => void
  image?: React.ReactNode
  loading?: boolean
  hideChevron?: boolean
  containerRef?: React.Ref<HTMLElement>
}

export const listItemImageSx = {
  gridArea: 'image',
}

const Title = styled(Typography, {name: 'ListItemTitle'})(() => ({
  gridArea: 'title',
  fontSize: 13,
  fontWeight: 475,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  alignSelf: 'end',
}))

const Description = styled(Typography, {name: 'ListItemDescription'})(() => ({
  gridArea: 'description',
  fontSize: 12,
  opacity: 0.5,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
}))

export const ObjectListItemStyle = styled(ItemStyle, {name: 'ObjectListItem'})<{
  _disabled?: boolean,
  _image?: any
}>(({theme, _image}) => {
  function getGridTemplateAreas() {
    if (!_image) {
      return '"title chevron" "description chevron"'
    }
    return '"image title chevron" "image description chevron"'
  }

  function getGridTemplateColumns() {
    if (!_image) {
      return '1fr 16px'
    }
    return 'auto 1fr 16px'
  }

  return {
    'display': 'grid',
    'gridTemplateAreas': getGridTemplateAreas(),
    'gridTemplateColumns': getGridTemplateColumns(),
    'columnGap': 12,
    'rowGap': 2,
    'height': 78,
    'padding': '12px',
    '&:last-of-type': {
      borderBottom: `1px solid ${theme.palette.spec.borderColor} !important`,
    },
  }
})

export class ObjectListItem extends PureComponent<Props> {
  render() {
    const {testId, title, description, image, loading, hideChevron} = this.props

    if (loading) {
      return (
        <ObjectListItemStyle sx={this.props.sx}>
          <Title>
            <Skeleton variant="text" width="80%"/>
          </Title>
          <Description>
            <Skeleton variant="text" width="50%"/>
          </Description>
          {image}
        </ObjectListItemStyle>
      )
    }

    return (
      <ObjectListItemStyle
        data-testid={testId}
        component="li"
        _image={image}
        onClick={() => this.props.onClick?.()}
        sx={this.props.sx}
        ref={this.props.containerRef}
      >
        {image}
        <Title title={title}>{title}</Title>
        <Description title={description}>{description}</Description>
        <Box sx={{
          gridArea: 'chevron',
          display: 'grid',
          placeItems: 'center',
          opacity: 0.3,
        }}>
          {!hideChevron &&
            <Icon icon="chevron-right"/>
          }
        </Box>
      </ObjectListItemStyle>
    )
  }
}
