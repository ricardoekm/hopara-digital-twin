import React from 'react'
import { MoreButtonItem } from './MoreButtonItem'
import { Icon } from '../icons/Icon'
import { PureComponent } from '../component/PureComponent'
import { PanelButton } from './PanelButton'
import {Menu} from '../Menu'

export interface MenuItem {
  disabled?: boolean
  tooltip?: string
  label: string
  onClick?: (id?: string) => void
  href?: string
  target?: React.HTMLAttributeAnchorTarget
  deleteConfirmMessage?: (obj) => string
  icon?: React.ReactNode
  color?: 'error'
}

export type MenuItemOrDivider = MenuItem | 'divider'

interface Props {
  id?: string
  menuItems: MenuItemOrDivider[]
  name?: string
}

interface State {
  anchorEl: HTMLElement | null
}

export class MoreButton extends PureComponent <Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      anchorEl: null,
    }
  }

  handleClick(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({anchorEl: event.currentTarget})
  }

  handleClose(event: React.MouseEvent<HTMLElement>) {
    if (event) {
      event?.preventDefault()
      event?.stopPropagation()
    }
    this.setState({anchorEl: null})
  }

  render() {
    const open = Boolean(this.state.anchorEl)

    if (!this.props.menuItems || this.props.menuItems.length === 0) {
      return <></>
    }

    return <>
      <PanelButton
        onClick={this.handleClick.bind(this)}>
        <Icon icon="more"/>
      </PanelButton>
      <Menu
        anchorEl={this.state.anchorEl}
        open={open}
        onClose={this.handleClose.bind(this)}
        container={document.getElementById('visualization-layout')}
      >
        {this.props.menuItems?.length ? this.props.menuItems.map(
          (item, index) => {
            return <MoreButtonItem
              id={this.props.id}
              name={this.props.name}
              key={index}
              onClose={this.handleClose.bind(this)}
              item={item}
            />
          },
        ) : <></>}
      </Menu>
    </>
  }
}
