import React from 'react'
import {DragDropContext, Draggable, Droppable} from '@hello-pangea/dnd'
import {ListStyle} from './List'
import {DraggableItem} from './DraggableItem'
import {ListItemData} from './ListItem'
import {MenuItemOrDivider} from '../buttons/MoreButton'
import {PureComponent} from '../component/PureComponent'
import {styled} from '../theme'

interface ItemWithIndex extends ListItemData {
  index: number
}

export interface DragEndData {
  source: ItemWithIndex
  destination: ItemWithIndex
}

interface Props {
  items: ListItemData[],
  sublist?: boolean,
  onItemClick?: (item: ListItemData) => void,
  menuItems?: (id: string) => MenuItemOrDivider[],
  onDragEnd?: (result: DragEndData) => void,
}

const DraggableListStyle = styled(ListStyle, {name: 'DraggableList'})((props) => ({
  'backgroundColor': props.theme.palette.spec.listBackground,
}))

export class DraggableList extends PureComponent <Props> {
  render() {
    if (this.props.items.length === 0) {
      return null
    }

    return <DragDropContext onDragEnd={(result) => {
      if (result.source && result.destination && this.props.onDragEnd) this.props.onDragEnd(result as any)
    }}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <DraggableListStyle
            className={this.props.sublist ? 'sublist' : ''}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {this.props.items.map((item, i) => {
              return <Draggable key={item.id} draggableId={item.id} index={i}>
                {(provided, snapshot) => (
                  <DraggableItem
                    index={i}
                    item={item}
                    provided={provided}
                    snapshot={snapshot}
                    menuItems={this.props.menuItems ? this.props.menuItems(item.id).map((menuItem) => {
                      if (menuItem === 'divider') return menuItem
                      return {
                        ...menuItem,
                        onClick: () => menuItem.onClick?.(item.id),
                      }
                    }) : undefined}
                    onClick={this.props.onItemClick && !item.disabled ? () => {
                      if (this.props.onItemClick && !item.disabled) this.props.onItemClick(item)
                    } : undefined}
                  />
                )}
              </Draggable>
            })}
            {provided.placeholder}
          </DraggableListStyle>
        )}
      </Droppable>
    </DragDropContext>
  }
}


