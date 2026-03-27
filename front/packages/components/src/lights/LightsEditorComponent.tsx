import React from 'react'
import { PureComponent } from '@hopara/design-system'
import {i18n} from '@hopara/i18n'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {Panel} from '@hopara/design-system/src/panel/Panel'
import { Box } from '@mui/material'
import { PanelField } from '@hopara/design-system/src/panel/PanelField'
import { Slider } from '@hopara/design-system/src'
import { PanelCard } from '@hopara/design-system/src/panel/PanelCard'

export interface StateProps {
  lights: Array<{name: string, title: string, config: {intensity: number, direction: number[]}}>
}

export interface ActionProps {
  onLightChange: (name: string, config: any) => void
}

export class LightsEditorComponent extends PureComponent<StateProps & ActionProps> {
  positionToAxis = (positionIndex: number) => {
    switch (positionIndex) {
      case 0:
        return 'x'
      case 1:
        return 'y'
      case 2:
        return 'z'
    }
  }

  handleIntensityChange(light: any, value: number) {
    this.props.onLightChange(light.name, {
      ...light.config,
      intensity: value,
    })
  }

  handleDirectionChange(light: any, index:number, value: number) {
    this.props.onLightChange(light.name, {
      ...light.config,
      direction: light.config.direction.map((pos, i) => i === index ? value : pos),
    })
  }

  render() {    
    return (
      <Panel header={<PanelTitleBar title={i18n('LIGHTS')}/>}>
        <Box sx={{}}>
          {this.props.lights.map((light, index) => {
            return (
              <PanelCard key={index} title={light.title} expandable defaultExpanded={index === 0}>
                <PanelField layout="inline" title={i18n('INTENSITY')}>
                  <Slider
                    value={light.config.intensity}
                    onChange={(e, value) => this.handleIntensityChange(light, value as number)}
                    min={0}
                    max={15}
                    step={0.1}
                    valueLabelDisplay="auto"/>
                </PanelField>
                {light.config.direction?.map((pos, i) => {
                  const axis = this.positionToAxis(i)
                  return (
                    <PanelField key={`${index}-${i}`} layout="inline" title={`${i18n('DIRECTION')} ${axis?.toUpperCase()}`}>
                      <Slider
                        value={pos}
                        onChange={(e, value) => this.handleDirectionChange(light, i, value as number)}
                        min={-50}
                        max={50}
                        step={0.25}
                        valueLabelDisplay="auto"/>
                    </PanelField>
                  )
                })}
              </PanelCard>
            )
          })}
        </Box>
      </Panel>
    )
  }
}
