import React from 'react'
import { PureComponent } from '@hopara/design-system'
import {Action, ActionType} from '../Action'
import {ListActionPillButton} from '@hopara/design-system/src/buttons/ListActionPillButton'
import {i18n} from '@hopara/i18n'
import {DraggableList, ListItemData} from '@hopara/design-system/src/list'
import {v4 as uuid} from 'uuid'
import {Empty} from '@hopara/design-system/src/empty/Empty'
import {Layer} from '../../layer/Layer'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {Box} from '@mui/material'
import { Actions } from '../Actions'

export interface StateProps {
  items: Actions;
  sublist?: boolean;
  layer?: Layer
}

export interface ActionProps {
  onItemClick?: (id: string) => void;
  newActionClick: () => void;
  onDelete: (id: string) => void;
  onMove: (args: { sourceIndex: number, destinationIndex: number }) => void;
}

type Props = StateProps & ActionProps

function getIconFromActionType(actionType: ActionType) {
  switch (actionType) {
    case ActionType.EXTERNAL_LINK_JUMP:
      return <Icon icon="link"/>
    case ActionType.VISUALIZATION_JUMP:
      return <Icon icon="visualization-jump"/>
    case ActionType.ZOOM_JUMP:
      return <Icon icon="zoom-jump"/>
    case ActionType.FUNCTION_CALLBACK:
      return <Icon icon="general"/>
    default:
      return undefined
  }
}

export class ActionsEditor extends PureComponent<Props> {
  onItemClick(item: ListItemData) {
    if (this.props.onItemClick) this.props.onItemClick(item.id as string)
  }

  newActionClick() {
    this.props.newActionClick()
  }

  onDragEnd(result: any) {
    this.props.onMove({
      sourceIndex: result.source.index,
      destinationIndex: result.destination.index,
    })
  }

  render() {
    return (
      <Box>
        <ListActionPillButton
          insideAccordion
          onClick={this.newActionClick.bind(this)}
          icon={<Icon icon="add"/>}>
          {i18n('NEW_ACTION')}
        </ListActionPillButton>

        {!this.props.items?.length &&
          <Empty
            description={i18n('ADD_ACTIONS_TO_YOUR_LAYER')}
          />
        }

        {!!this.props.items?.length &&
          <DraggableList
            sublist={this.props.sublist}
            items={this.props.items.map((item: Action) => {
              return {
                id: item.id ?? uuid(),
                name: item.title,
                icon: getIconFromActionType(item.type),
              }
            })}
            onItemClick={this.onItemClick.bind(this)}
            menuItems={() => ([{
              label: i18n('DELETE'),
              color: 'error',
              onClick: (id) => {
                this.props.onDelete(id as string)
              },
            }])}
            onDragEnd={this.onDragEnd.bind(this)}
          />
        }
      </Box>
    )
  }
}
