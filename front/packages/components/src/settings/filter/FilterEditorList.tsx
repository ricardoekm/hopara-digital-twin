import React from 'react'
import {i18n} from '@hopara/i18n'
import {DraggableList, ListItemData} from '@hopara/design-system/src/list'
import {Authorization} from '@hopara/authorization'
import {Filter} from '../../filter/domain/Filter'
import {Empty} from '@hopara/design-system/src/empty/Empty'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {filterMenuFactory} from './FilterMenu'
import { Filters } from '../../filter/domain/Filters'

interface Props {
  list: Filters | Filter[];
  authorization: Authorization;
  onItemClick: (option: ListItemData) => void;
  onDeleteClick: (id: string) => void;
  onMove: (id: string, steps: number) => void;
  onAdvancedModeClick: (id: string) => void;
}

export const FilterEditorList = (props: Props) => {
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) return
    props.onMove(
      props.list[result.source.index].getId(),
      result.destination.index - result.source.index,
    )
  }

  return (
    <>
        {!props.list?.length &&
          <Empty
            noBorder
            description={i18n('EMPTY_FILTERS')}
            documentationURL={'https://docs.hopara.app/fundamentals/filters'}
          />
        }

      {!!props.list?.length &&
        <DraggableList
          items={props.list.map((item) => {
            return {
              id: item.getId(),
              name: item.getTitle(),
              icon: <Icon icon={item.singleChoice ? 'single' : 'multiple'} size="md"/>,
            }
          }) as ListItemData[]}
          onDragEnd={onDragEnd}
          menuItems={() =>
            filterMenuFactory({
              onAdvancedModeClick: props.onAdvancedModeClick,
              onDeleteClick: props.onDeleteClick,
            })
          }
          onItemClick={props.onItemClick}
        />
      }
    </>
  )
}
