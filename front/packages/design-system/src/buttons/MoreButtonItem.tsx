import React from 'react'
import { Divider, ListItemIcon, ListItemText, MenuItem } from '@mui/material'
import { MenuItemOrDivider } from './MoreButton'
import { DeleteDialog } from '../dialogs/DeleteDialog'
import {Theme, withTheme} from '../theme'
import { PureComponent } from '../component/PureComponent'

interface Props {
  onClose: (event: React.MouseEvent<HTMLElement>) => void
  item: MenuItemOrDivider
  id?: string
  name?: string
  icon?: React.ReactNode
  theme: Theme
}

interface State {
  open: boolean
}

class MoreButtonItemClass extends PureComponent <Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      open: false,
    }
  }

  render() {
    const item = this.props.item
    if (item === 'divider') return <Divider />
    return <>
      <MenuItem
        disabled={item.disabled}
        onClick={!item.href && !item.disabled ? (event) => {
          event.preventDefault()
          event.stopPropagation()
          if (item.deleteConfirmMessage) return this.setState({open: true})
          if (item.onClick) item.onClick(this.props.id)
          this.props.onClose(event)
        } : undefined}
        component='a'
        href={item.disabled ? undefined : item.href}
        target={item.href && !item.disabled ? item.target : undefined}
        sx={{
          'color': item.color === 'error' ? this.props.theme.palette.spec.error : 'inherit',
          '&.Mui-disabled': {
            opacity: 0.5,
            cursor: 'not-allowed',
            pointerEvents: 'auto',
          },
          '&.Mui-disabled:hover': {
            backgroundColor: 'transparent',
          },
        }}
      >
        {item.icon && <ListItemIcon sx={{color: this.props.theme.palette.primary.main}}>
          {item.icon}
        </ListItemIcon>}
        <ListItemText>
          {item.label}
        </ListItemText>
      </MenuItem>
      {item.deleteConfirmMessage && <DeleteDialog
        open={this.state.open}
        onCancel={() => {
          this.setState({open: false})
          this.props.onClose(null as any)
        }}
        onDelete={() => {
          if (item.onClick) item.onClick(this.props.id)
          this.setState({open: false})
          this.props.onClose(null as any)
        }}
        isDeleting={false}
        message={item.deleteConfirmMessage(this.props.name)}
      />}
    </>
  }
}

export const MoreButtonItem = withTheme<Props>(MoreButtonItemClass)

