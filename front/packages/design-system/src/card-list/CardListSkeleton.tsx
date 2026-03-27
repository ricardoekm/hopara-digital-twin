import React from 'react'
import { CardListItem, CardListItemSize } from './CardListItem'
import { CardList, CardListTemplate } from './CardList'

export const CardListSkeleton = (props: {
  count: number;
  size?: CardListItemSize;
  testId?: string;
  style?: any;
}) => {
  return (
    <CardList data-testid={props.testId}>
      {[...Array(props.count)].map((_, index) => (
        <CardListItem
          key={index}
          size={props.size}
          loading
          style={props.style}
        />
      ))}
    </CardList>
  )
}

export const CardListTemplateSkeleton = (props: {
  count: number;
  size?: CardListItemSize;
  testId?: string;
  style?: any;
}) => {
  return (
    <CardListTemplate data-testid={props.testId}>
      {[...Array(props.count)].map((_, index) => (
        <CardListItem
          key={index}
          size={props.size}
          loading
          style={props.style}
        />
      ))}
    </CardListTemplate>
  )
}
