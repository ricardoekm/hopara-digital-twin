import React from 'react'
import {PureComponent} from '@hopara/design-system'
import Box from '@mui/material/Box'
import {i18n} from '@hopara/i18n'
import {Details} from '../../../details/Details'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {Columns} from '@hopara/dataset'
import {DetailsField} from '../../../details/DetailsField'
import {DetailsFields} from '../../../details/DetailsFields'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {Tooltip} from '@mui/material'
import {StaticList, DraggableList, DragEndData} from '@hopara/design-system/src/list'

export interface StateProps {
  details: Details
  columns: Columns
  layerId: string
}

export interface ActionProps {
  onChange: (details: Details) => void
  onItemClick?: (id: string) => void
}

type Props = StateProps & ActionProps

const TooltipEditor = (props: { enabled: boolean, onChange: (enabled: boolean) => void }) => {
  return <PanelGroup
    title={i18n('SHOW_TOOLTIP')}
    helperText={i18n('TOOLTIP_HELPER')}
    canBeEnabled
    enabled={props.enabled}
    onEnabledChange={props.onChange}
    inline
  />
}

function fieldToListItem(detailsField: DetailsField, title: string, icon: 'add-circle' | 'remove-circle', label: string | undefined, onClick: () => void) {
  return {
    id: detailsField.getField(),
    name: detailsField.getLabel(),
    label,
    icon: <Tooltip
      title={title}
      placement="top" disableInteractive>
      <Box
        sx={{
          'display': 'flex',
          'alignItems': 'center',
          'transition': 'all 100ms ease-out',
          '&:hover': {'transform': 'scale(1.2)'},
          '&:active': {'transform': 'scale(1)'},
        }}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}>
        <Icon icon={icon} />
      </Box>
    </Tooltip>,
  }
}

const ListTitle = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ marginBlockStart: 12 }}>{children}</Box>
)

export class DetailsEditor extends PureComponent<Props> {
  constructor(props) {
    super(props)
  }

  getFields() {
    const fields = new DetailsFields(...this.props.details.fields ?? [])
    return fields.unionColumns(this.props.columns)
  }

  getVisibleItems() {
    return this.getFields().filter((f) => !!f.visible)
  }

  getHiddenItems() {
    return this.getFields().filter((g) => !g.visible)
  }

  changeFields(fields: DetailsFields) {
    this.props.onChange(this.props.details.immutableSetFields(fields))
  }

  onVisibleDragEnd(result: DragEndData) {
    const visibleItems = this.getVisibleItems()
    const hiddenItems = this.getHiddenItems()
    const [removed] = visibleItems.splice(result.source.index, 1)
    visibleItems.splice(result.destination.index, 0, removed)
    const newFields = new DetailsFields(...visibleItems, ...hiddenItems)
    this.changeFields(newFields)
  }

  getVisibleListItems() {
    const visibleItems = this.getVisibleItems()
    const firstItemTxt = visibleItems.find((item) => item.value.encoding.text)
    return visibleItems.map((item) => {
      const isTitle = item.getField() === firstItemTxt?.getField()
      return fieldToListItem(item, i18n('HIDE'), 'remove-circle', isTitle ? i18n('TITLE') : undefined, () => {
        this.changeFields(this.getFields().immutableHideField(item.getField()))
      })
    })
  }

  render() {
    return <>
      <TooltipEditor
        enabled={this.props.details.tooltip !== false}
        onChange={(enabled) => {
          this.props.details.tooltip = enabled
          this.props.onChange(this.props.details)
        }}
      />
      {this.getVisibleItems().length > 0 && <>
        <ListTitle>{i18n('SHOW')}</ListTitle>
        <DraggableList
          sublist={true}
          items={this.getVisibleListItems()}
          onItemClick={(option) => this.props.onItemClick?.(option.id)}
          onDragEnd={(event) => this.onVisibleDragEnd(event)}
        />
      </>}
      {this.getHiddenItems().length > 0 && <>
        <ListTitle>{i18n('HIDE')}</ListTitle>
        <StaticList
          sublist={true}
          items={this.getHiddenItems().map((item) => fieldToListItem(item, i18n('SHOW'), 'add-circle', undefined, () => {
            this.changeFields(this.getFields().immutableShowField(item.getField()))
          }))}
          onItemClick={(option) => this.props.onItemClick?.(option.id)}
        />
      </>}
    </>
  }
}
