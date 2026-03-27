import React from 'react'
import {PureComponent} from '@hopara/design-system/src/component/PureComponent'
import {i18n} from '@hopara/i18n'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {Empty} from '@hopara/design-system/src/empty/Empty'
import {Floor} from '../../floor/Floor'
import {Floors} from '../../floor/Floors'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {PanelCard, PanelCards} from '@hopara/design-system/src/panel/PanelCard'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {TextField} from '@hopara/design-system/src'
import {DraggableList} from '@hopara/design-system/src/list'
import {PanelButton} from '@hopara/design-system/src/buttons/PanelButton'
import {SlideTransition, TransitionType} from '@hopara/design-system/src/transitions/SlideTransition'
import {SubPanel, SubPanelWrapper} from '@hopara/design-system/src/panel/SubPanel'

export type StateProps = {
  items: Floors
  selectedId?: string
}

export type ActionProps = {
  onChange: (id: string, name: string) => void
  onSelect: (id?: string) => void
  onCreate: () => void
  onDelete: (name: string) => void
  onDragEnd: (sourceIndex: number, destinationIndex: number) => void
}

export type Props = StateProps & ActionProps


export class FloorEditorComponent extends PureComponent<Props> {
  render(): React.ReactNode {
    if (!this.props.items) return null
    const selectedItem = this.props.items.find((i) => i.id === this.props.selectedId)
    return (<SubPanelWrapper>
      <SlideTransition transition={selectedItem ? TransitionType.RIGHT : TransitionType.LEFT}>
        {!selectedItem && <SubPanel
          header={
            <PanelTitleBar
              title={i18n('FLOORS')}
              buttons={[
                <PanelButton
                  key="add"
                  onClick={this.props.onCreate}
                >
                  <Icon icon="add"/>
                </PanelButton>,
              ]}
            />}
        >
          {!this.props.items?.length &&
            <Empty
            noBorder
            description={i18n('ADD_FLOORS_TO_YOUR_ORGANIZATION')}
            />
          }

          {!!this.props.items?.length &&
            <DraggableList
              items={this.props.items.map((floor: Floor) => {
                return {
                  id: floor.id,
                  name: floor.name,
                  icon: <>{floor.acronym}</>,
                }
              })}
              menuItems={() => ([{
                label: i18n('DELETE'),
                deleteConfirmMessage: (floor) => i18n('ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_FLOOR', {name: floor}),
                color: 'error',
                onClick: (id) => {
                  if (id) this.props.onDelete(id)
                },
              }])}
              onDragEnd={(result: any) => {
                const si = this.props.items.length - result.source.index - 1
                const di = this.props.items.length - result.destination.index - 1
                this.props.onDragEnd(si, di)
              }}
            />
          }
        </SubPanel>}
        {selectedItem && <SubPanel
          header={<PanelTitleBar
            title={i18n('FLOOR')}
            onBackClick={() => {
              this.props.onSelect(undefined)
            }}
          />}
        >
          <PanelCards>
            <PanelCard>
              <PanelField
                title={i18n('NAME')}
                layout="inline"
              >
                <TextField
                  placeholder={selectedItem.name}
                  autoFocus
                  onChange={(e) => {
                    selectedItem.name = e.target.value
                    this.props.onChange(selectedItem.id, e.target.value)
                  }}
                />
              </PanelField>
            </PanelCard>
          </PanelCards>
        </SubPanel>}
      </SlideTransition>
    </SubPanelWrapper>)
  }
}
