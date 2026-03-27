import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {ListActionPillButton} from '@hopara/design-system/src/buttons/ListActionPillButton'
import {i18n} from '@hopara/i18n'
import {DraggableList} from '@hopara/design-system/src/list'
import {Empty} from '@hopara/design-system/src/empty/Empty'
import {Layer} from '../../Layer'
import {LayerIcon} from '../../LayerIcon'
import Visualization from '../../../visualization/Visualization'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {childrenLayerMenuFactory} from '../LayerMenu'

export interface StateProps {
  items: Layer[];
  layer: Layer;
  visualization: Visualization;
}

export interface ActionProps {
  onChange: (layers: Layer[]) => void;
  onItemClick?: (id: string) => void;
  onNewLayerClick: (parentId: string) => void;
  onItemAdvancedModeClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
  onDuplicateClick: (id: string) => void;
}

type Props = StateProps & ActionProps

export class ChildrenEditor extends PureComponent<Props> {
  onItemClick(id: string) {
    if (this.props.onItemClick) this.props.onItemClick(id as string)
  }

  newLayerClick() {
    this.props.onNewLayerClick(this.props.layer.getId())
  }

  onDragEnd(result: any) {
    const items = [...this.props.items].reverse()
    const [removed] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, removed)
    items.reverse()
    this.props.onChange(items)
  }

  render() {
    return (
      <>
        <ListActionPillButton
          insideAccordion
          onClick={this.newLayerClick.bind(this)}
          icon={<Icon icon="add"/>}
          testId='new-child-layer'
        >
          {i18n('NEW_CHILD_LAYER')}
        </ListActionPillButton>

        {!this.props.items?.length &&
          <Empty
            description={i18n('ADD_CHILD_LAYERS_TO_YOUR_LAYER')}
          />
        }

        {!!this.props.items?.length &&
          <DraggableList
            sublist={true}
            items={[...this.props.items].reverse().map((item: Layer) => {
              return {
                id: item.getId(),
                name: item.name,
                icon: <LayerIcon type={item.type}/>,
              }
            })}
            onItemClick={(option) => this.onItemClick(option.id)}
            menuItems={() => childrenLayerMenuFactory({
              onLayerDeleteClick: (id) => {
                this.props.onDeleteClick(id)
              },
              onAdvancedModeClick: (id) => {
                this.props.onItemAdvancedModeClick(id)
              },
              onLayerDuplicateClick: (id) => {
                this.props.onDuplicateClick(id)
              },
            })}
            onDragEnd={this.onDragEnd.bind(this)}
          />
        }
      </>
    )
  }
}
