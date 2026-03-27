import React from 'react'
import {SelectOption, Slider} from '@hopara/design-system/src/form'
import {ThumbFormat} from '@hopara/design-system/src/form/Slider'
import {Visible} from '../../Visible'
import FieldEditor from '../field/FieldEditor'
import {ZoomRange} from '../../../zoom/ZoomRange'
import {i18n} from '@hopara/i18n'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {Box, Switch} from '@mui/material'
import {PureComponent} from '@hopara/design-system'
import { Columns } from '@hopara/dataset'

export interface StateProps {
  visible: Visible
  fieldOptions: SelectOption[]
  maxZoom: number
  minZoom: number
  zoom: number
  showCondition: boolean
  showZoomRange: boolean
  showToggle: boolean
  layerId: string
  layerQueryColumns?: Columns
}

export interface ActionProps {
  onChange: (visible: Visible) => void;
}

type Props = StateProps & ActionProps

class VisibilityEditor extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.updateZoomRange = this.updateZoomRange.bind(this)
  }

  toggle() {
    const visible = new Visible({
      ...this.props.visible,
      value: !this.props.visible.value,
    })

    this.props.onChange(visible)
  }

  updateZoomRange(event) {
    const visible = new Visible({
      ...this.props.visible,
      zoomRange: new ZoomRange({
        min: {value: event.target.value[0]},
        max: {value: event.target.value[1]},
      }),
    })

    this.props.onChange(visible)
  }

  handleConditionFieldChange(field: any) {
    const visible: Visible = new Visible({
      ...this.props.visible,
    })

    visible.condition = field ? {test: {field}} : undefined
    this.props.onChange(visible)
  }


  render() {
    const maxZoom = this.props.maxZoom

    return (
      <PanelGroup
        inline={this.props.showToggle}
        title={this.props.showToggle ? i18n('VISIBLE') : undefined}
        canBeEnabled={this.props.showToggle}
        enabled={this.props.visible.value}
        onEnabledChange={this.toggle.bind(this)}>
        {(this.props.visible.value || !this.props.showToggle) && <>
          {this.props.showCondition && <>
            <PanelField
              layout="inline"
              title={i18n('CONDITION')}
            >
              <FieldEditor
                options={this.props.fieldOptions}
                field={this.props.visible.condition?.test.field}
                columns={this.props.layerQueryColumns}
                includeNullOption={true}
                nullOptionLabel={i18n('NONE_FEMALE')}
                onChange={this.handleConditionFieldChange.bind(this)}
                helperText={i18n('VISIBILITY_CONDITION_HELPER')}
              />
            </PanelField>
            {this.props.visible.condition?.test && <PanelField
              layout="inline"
              title={i18n('REVERSE_CONDITION')}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'right',
                }}
              >
                <Switch
                  checked={this.props.visible.condition?.test?.reverse ?? false}
                  onChange={(event) => {
                    const visible = {
                      ...this.props.visible,
                      condition: {
                        ...this.props.visible.condition,
                        test: {
                          ...this.props.visible.condition?.test,
                          reverse: event.target.checked,
                        },
                      },
                    }

                    this.props.onChange(visible as any)
                  }}
                />
              </Box>
            </PanelField>
            }
          </>}
          {this.props.showZoomRange && <PanelField layout="inline" title={i18n('ZOOM')}>
            <Slider
              min={this.props.minZoom}
              max={maxZoom}
              indicator={this.props.zoom}
              step={0.5}
              thumbFormats={[
                ThumbFormat.RECTANGLE,
                ThumbFormat.RECTANGLE,
              ]}
              value={[
                this.props.visible.zoomRange?.getMin() ?? this.props.minZoom,
                this.props.visible.zoomRange?.getMax() ?? this.props.maxZoom,
              ]}
              onChange={this.updateZoomRange.bind(this)}
              valueLabelDisplay="auto"
              valueLabelFormat={(level, pos) => {
                const formattedLevel = level.toFixed(1) // Always 1 decimal place for consistent width
                
                if (pos === 0) {
                  return (
                    <Box sx={{textAlign: 'center'}}>
                      {i18n('VISIBLE_FROM')} zoom<br/>{formattedLevel}
                    </Box>
                  )
                }
                if (pos === 1) {
                  return (
                    <Box sx={{textAlign: 'center'}}>
                      {i18n('VISIBLE_UNTIL')} zoom<br/>{formattedLevel}
                    </Box>
                  )
                }
              }}
            />
          </PanelField>}
        </>}
      </PanelGroup>
    )
  }
}

export default VisibilityEditor
