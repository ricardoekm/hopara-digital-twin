import React from 'react'
import {PureComponent} from '../component/PureComponent'
import {MenuItemOrDivider} from '../buttons/MoreButton'
import {ItemIcon, ItemMenu, ItemStyle, ItemText} from './ListItem'

interface Props {
  menuItems?: MenuItemOrDivider[]
  disabled?: boolean
  onClick?: () => void
  icon: React.ReactNode
  name: string
  id?: string
}

export class StaticItem extends PureComponent<Props> {
  render() {
    return <ItemStyle _disabled={this.props.disabled}>
      <ItemIcon>{this.props.icon}</ItemIcon>
      <ItemText onClick={this.props.onClick}>{this.props.name}</ItemText>
      <ItemMenu id={this.props.id} name={this.props.name} menuItems={this.props.menuItems}/>
    </ItemStyle>
  }
}
