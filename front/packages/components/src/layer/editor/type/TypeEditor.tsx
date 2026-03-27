import React from 'react'
import {Select, SelectOption} from '@hopara/design-system/src/form'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {i18n} from '@hopara/i18n'
import {Box, MenuItem} from '@mui/material'
import {LayerType} from '../../LayerType'
import {PureComponent} from '@hopara/design-system'
import Visualization from '../../../visualization/Visualization'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {LayerTemplate, LayerTemplateConfig} from '../../template/domain/LayerTemplate'
import {default as alertingDot} from '../../template/images/alerting-dot.svg'
import {default as alertingIcon} from '../../template/images/alerting-icon.svg'
import {default as alertingIconAlternative} from '../../template/images/alerting-icon-alternative.svg'
import {default as alertingIconWithText} from '../../template/images/alerting-icon-with-text.svg'
import {default as alertingText} from '../../template/images/alerting-text.svg'
import {default as iconWithBackground} from '../../template/images/icon-with-background.svg'
import {default as iconWithBadge} from '../../template/images/icon-with-badge.svg'
import {default as textBox} from '../../template/images/text-box.svg'
import {LayerIcon} from '../../LayerIcon'

const images = {
  'alerting-dot': alertingDot,
  'alerting-icon': alertingIcon,
  'alerting-icon-alternative': alertingIconAlternative,
  'alerting-icon-with-text': alertingIconWithText,
  'alerting-text': alertingText,
  'icon-with-background': iconWithBackground,
  'icon-with-badge': iconWithBadge,
  'text-box': textBox,
}

export interface StateProps {
  type: LayerType
  options: SelectOption[]
  visualization: Visualization
  layerId: string
  layerType: LayerType
  templates: LayerTemplate[]
  template: LayerTemplateConfig | undefined
}

export interface ActionProps {
  onChange: (type: string) => void
  onTemplateTypeChange: (templateId: string) => void
}

type Props = StateProps & ActionProps

class TypeEditor extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    const options = this.props.options.map((option) => ({
      value: option.value,
      label: option.label,
    })).sort((a, b) => a.label.localeCompare(b.label))

    return (
      <PanelGroup
        title={i18n('TYPE')}
        inline
        secondaryAction={
          <Select
            testId='select-type'
            value={this.props.type}
            options={options}
            onChange={(event) => this.props.onChange(event.target.value)}
            enableCustomization={true}
            renderOption={(props, option) => {
              return <MenuItem
                component="li"
                {...props}
                key={option.value}
                value={option.value}
                data-value={option.value}
                data-label={option.label}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '.5em',
                }}
              >
                <LayerIcon type={option.value} isChart={this.props.visualization.isChart()}/>
                <Box>{option.label}</Box>
              </MenuItem>
            }}
          />}
      >
        {this.props.layerType === LayerType.template && <PanelField
          layout="inline"
          title={i18n('TEMPLATE')}
        >
          <Select
            isImage
            testId='select-template'
            value={this.props.template?.id}
            options={this.props.templates.map((template) => ({
              value: template.id,
              label: template.name,
            }))}
            sx={{
              '[role="combobox"]': {
                'display': 'flex',
                'padding': 0,
                'gap': 0,
                'alignItems': 'center',
                'justifyContent': 'center',
                'overflow': 'hidden',
                'textOverflow': 'ellipsis',
                'img': {
                  height: 40,
                },
              },
            }}
            onChange={(event) => this.props.onTemplateTypeChange(event.target.value)}
            enableCustomization={true}
            renderOption={(props, option) => {
              return <MenuItem
                component="li"
                {...props}
                key={option.value}
                value={option.value}
                data-value={option.value}
                data-label={option.label}
                sx={{
                  'display': 'flex',
                  'flexDirection': 'row',
                  'alignItems': 'center',
                  'gap': '.5em',
                  'padding': 0,
                  'justifyContent': 'center',
                  '&>img': {
                    height: 70,
                  },
                }}
              >
                <img src={images[option.value]}/>
              </MenuItem>
            }}
          />
        </PanelField>}
      </PanelGroup>
    )
  }
}

export default TypeEditor
