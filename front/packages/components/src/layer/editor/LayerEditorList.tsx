import React from 'react'
import {PureComponent} from '@hopara/design-system'
import Box from '@mui/material/Box'
import {ListActionPillButton} from '@hopara/design-system/src/buttons/ListActionPillButton'
import {Layers} from '../Layers'
import {i18n} from '@hopara/i18n'
import {DraggableList} from '@hopara/design-system/src/list'
import {Empty} from '@hopara/design-system/src/empty/Empty'
import {Layer} from '../Layer'
import {layerMenuFactory} from './LayerMenu'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {Skeleton} from '@mui/material'
import {LayerIcon} from '../LayerIcon'

type Props = {
  visualizationIsChart: boolean
  list: Layers
  isItemLoading: boolean
  onNewLayerClick: () => void
  onLayerMove: (item: any, steps: number) => void
  onLayerDeleteClick: (id: string) => void
  onLayerDuplicateClick: (id: string) => void
  onLayerClick: (id: string) => void
  onEditInAdvancedModeClick: (layer: Layer) => void;
  onLayerEjectClick: (id: string) => void
}

export class LayerEditorList extends PureComponent<Props> {
  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) return
    this.props.onLayerMove(
      this.props.list[result.source.index],
      result.destination.index - result.source.index,
    )
  }

  render() {
    const reversedList = [...this.props.list].reverse()

    if (this.props.isItemLoading) {
      return (<Box sx={{padding: 16}}>
          <Skeleton animation="wave" width="75%"/>
          <Skeleton animation="wave" width="50%"/>
        </Box>
      )
    }
    return (
      <>
        <Box sx={{paddingLeft: 12, paddingRight: 12}}>
          <ListActionPillButton
            onClick={this.props.onNewLayerClick}
            icon={<Icon icon='add'/>}
            testId='button_new_layer'
          >
            {i18n('NEW_LAYER')}
          </ListActionPillButton>

          {!this.props.list?.length &&
            <Empty
              description={i18n('EMPTY_LAYERS')}
              documentationURL={'https://docs.hopara.app/fundamentals/layers'}
            />
          }
        </Box>

        {!!this.props.list?.length &&
          <DraggableList
            items={reversedList.map((item) => {
              return {
                id: item.getId(),
                name: item.name,
                icon: <LayerIcon type={item.type} isChart={this.props.visualizationIsChart}/>,
              }
            })}
            onItemClick={(option) => this.props.onLayerClick(option.id)}
            menuItems={(id) => {
              const layer = this.props.list.find((layer) => layer.getId() === id)!
              return layerMenuFactory({
                layer, callbacks: {
                  onLayerDeleteClick: this.props.onLayerDeleteClick,
                  onLayerDuplicateClick: this.props.onLayerDuplicateClick,
                  onAdvancedModeClick: (id: string) => {
                    const layer = this.props.list.find((layer) => layer.getId() === id)
                    if (layer) {
                      this.props.onEditInAdvancedModeClick(layer)
                    }
                  },
                  onLayerEjectClick: this.props.onLayerEjectClick,
                },
              })
            }}
            onDragEnd={(result) => {
              result.source.index = reversedList.length - result.source.index - 1
              result.destination.index = reversedList.length - result.destination.index - 1
              this.onDragEnd(result)
            }}
          />
        }
      </>
    )
  }
}
