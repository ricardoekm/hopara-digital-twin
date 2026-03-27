import React from 'react'
import {Box} from '@mui/material'
import {Icon} from '../icons/Icon'
import {MenuItemOrDivider, MoreButton} from '../buttons/MoreButton'
import {styled} from '../theme'

export interface ListItemData {
  id: string
  name?: string
  label?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export const ItemStyle = styled(Box, {name: 'Item'})<{
  _disabled?: boolean,
  _selected?: boolean,
  _clickable?: boolean
}>((props) => ({
  'userSelect': 'none',
  'cursor': props._clickable == false ? 'inherit !important' : props._disabled ? 'grab !important' : 'pointer !important',
  'position': 'relative',
  'display': 'flex',
  'flexDirection': 'row',
  'padding': '8px 16px 8px 16px',
  'minHeight': 46,
  'alignItems': 'center',
  'overflow': 'hidden',
  'borderBottom': `1px solid ${props.theme.palette.spec.borderColor}`,
  'backgroundColor': props._selected ? props.theme.palette.spec.itemBackgroundActive : props.theme.palette.background.default,
  '&:hover': {
    backgroundColor: props._clickable != false ? props.theme.palette.spec.itemBackgroundHover : 'inherit',
  },
  '&:active': {
    backgroundColor: props._disabled || props._clickable != false ? props.theme.palette.background.default : props.theme.palette.spec.itemBackgroundActive,
  },
  '&:last-child': {
    borderBottom: 'none',
  },
}))

export function DragHandle() {
  return <Box sx={{
    opacity: 0.33,
    transform: 'translateX(-0.33em)',
    cursor: 'grab',
    display: 'flex',
    alignItems: 'center',
  }}>
    <Icon icon="drag"/>
  </Box>
}

export const ItemIcon = styled(Box, {name: 'ItemIcon'})(({theme}) => ({
  width: 'max-content',
  color: theme.palette.primary.main,
  minWidth: 34,
  display: 'flex',
  alignItems: 'center',
}))

export const ItemText = styled(Box, {name: 'ItemText'})({
  flexGrow: 1,
})

export function ItemMenu(props: { id?: string, name?: string, menuItems?: MenuItemOrDivider[] }) {
  return <Box sx={{
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: 'translateY(-50%)',
  }}>
    {props.menuItems && <MoreButton id={props.id} name={props.name} menuItems={props.menuItems}/>}
  </Box>
}
