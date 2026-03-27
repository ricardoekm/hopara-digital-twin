import React from 'react'
import {StaticItem} from './StaticItem'
import {ListStyle} from './List'
import {MenuItemOrDivider} from '../buttons/MoreButton'
import {ListItemData} from './ListItem'

interface Props {
  items: ListItemData[];
  sublist?: boolean;
  menuItems?: MenuItemOrDivider[];
  onItemClick?: (item: ListItemData) => void;
}

export const StaticList = (props: Props) => {
  return <ListStyle className={props.sublist ? 'sublist' : ''}>
    {props.items.map((item) => {
      return <StaticItem
        key={item.id}
        disabled={item.disabled}
        menuItems={props.menuItems ? props.menuItems.map((menuItem) => {
          if (menuItem === 'divider') return menuItem
          return {
            ...menuItem,
            onClick: () => menuItem.onClick && menuItem.onClick(item.id),
          }
        }) : undefined}
        onClick={() => {
          if (props.onItemClick) props.onItemClick(item)
        }}
        icon={item.icon}
        name={item.name ?? ''}
      />
    })}
  </ListStyle>
}
