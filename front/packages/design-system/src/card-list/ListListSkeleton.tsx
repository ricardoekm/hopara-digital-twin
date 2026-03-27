import React from 'react'
import {ListListItem} from './ListListItem'
import {ListList} from './ListList'

export const ListListSkeleton = (props: {count: number, testId?: string}) => {
  return <ListList data-testid={props.testId}>
    {[...Array(props.count)].map((_, index) => (
      <ListListItem key={index} loading/>
    ))}
  </ListList>
}
