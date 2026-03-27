import React from 'react'
import ReactDOM from 'react-dom'
import {Chip} from '@mui/material'
import {DragHandle, ItemIcon, ItemMenu, ItemStyle, ItemText, ListItemData} from './ListItem'
import {styled} from '../theme'
import {MenuItemOrDivider} from '../buttons/MoreButton'
import {PureComponent} from '../component/PureComponent'

const DraggableItemStyle = styled(ItemStyle, {name: 'DraggableItem'})((props) => ({
  '&.isDragging': {
    'borderRadius': 6,
    'boxShadow': '0 2px 4px -1px rgba(0,0,0,0.15)',
    'border': `1px solid ${props.theme.palette.spec.borderColor}`,
  },
}))

interface Props {
  onClick?: (item: ListItemData) => void,
  item: ListItemData,
  menuItems?: MenuItemOrDivider[]
  index?: number
  snapshot: any
  provided: any
}

export class DraggableItem extends PureComponent<Props> {
  portalElementId = '__hopara__layerDraggablePortal'

  createPortal() {
    const portal: HTMLElement = document.createElement('div')
    portal.id = this.portalElementId
    document.body.appendChild(portal)
  }

  getPortal() {
    return document.querySelector(`#${this.portalElementId}`)!
  }

  deletePortal() {
    return this.getPortal()?.remove()
  }

  componentDidMount() {
    this.createPortal()
  }

  componentWillUnmount() {
    this.deletePortal()
  }

  render() {
    const provided = this.props.provided
    const snapshot = this.props.snapshot
    const usePortal = snapshot.isDragging
    const disabled = this.props.item.disabled || !this.props.onClick

    const child = (
        <DraggableItemStyle
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={provided.draggableProps.style}
          className={`${snapshot.isDragging ? 'isDragging' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={!disabled ? () => {
            this.props.onClick?.(this.props.item)
          } : undefined}
        >
          <DragHandle/>
          {this.props.item.icon && <ItemIcon>{this.props.item.icon}</ItemIcon>}
          <ItemText>{this.props.item.name}</ItemText>
          {this.props.item.label && !snapshot.isDragging && <Chip label={this.props.item.label} size="small"/>}
          {!!this.props.menuItems?.length && <ItemMenu
            id={this.props.item.id}
            name={this.props.item.name}
            menuItems={this.props.menuItems}
          />}
        </DraggableItemStyle>
    )

    if (usePortal) {
      return ReactDOM.createPortal(<>{child}</>, this.getPortal())
    }
    return child
  }
}

