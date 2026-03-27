import React from 'react'
import Case from 'case'
import {Select, SelectOption, Slider} from '@hopara/design-system/src/form'
import FieldEditor from '../field/FieldEditor'
import {LayerType} from '../../LayerType'
import {i18n} from '@hopara/i18n'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {PureComponent} from '@hopara/design-system'
import { VisualizationType } from '../../../visualization/Visualization'
import {Box, MenuItem, Switch, SxProps} from '@mui/material'
import {styled} from '@hopara/design-system/src'
import { Columns } from '@hopara/dataset'
import { animationLayerTypes } from '../../animation/AnimationType'
import { DEFAULT_ANIMATION_SPEED, MAX_ANIMATION_SPEED, MIN_ANIMATION_SPEED } from '../../animation/AnimationSpeed'
import { getCssAnimation } from '../../animation/CssAnimation'
import { AnimationEncoding, AnimationType, AnimationSpeed } from '@hopara/encoding'

export interface StateProps {
  layerId: string
  encoding: AnimationEncoding
  layerType: LayerType
  layerQueryColumns?: Columns
  visualizationType: VisualizationType
  fieldOptions: SelectOption[]
}

export interface ActionProps {
  onChange: (value: AnimationEncoding) => void
}

type Props = StateProps & ActionProps

const Animation = styled(Box, {name: 'Animation'})<{type: AnimationType, speed: AnimationSpeed}>(({type, speed}) => {
  const cssAnimation = getCssAnimation(type, speed)
  return {
    [`@keyframes animation-${type}`]: cssAnimation.keyFrames,
    animationName: `animation-${type}`,
    animationDuration: cssAnimation.duration,
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  }
})

const getTypeOptions = (layerType: LayerType, currentType?: AnimationType) => {
  const typeOptions = ['custom', ...Object.keys(AnimationType)].map((key) => ({
    value: key,
    label: Case.title(key),
  }))
  if (currentType === 'custom') {
    return typeOptions
  }
  return typeOptions
    .filter((option) => option.value !== AnimationType.custom)
    .filter((option) => {
      if (option.value === 'custom') return true
      const animationTypesForLayerType = animationLayerTypes[option.value]
      return animationTypesForLayerType.includes(layerType)
    })
}

export const AnimationCircle = (props: {
  type: AnimationType,
  speed: AnimationSpeed,
  sx?: SxProps,
}) => {
  return <Animation
    type={props.type}
    speed={props.speed}
  >
    <Box sx={{
      width: '16px',
      height: '16px',
      backgroundColor: (theme) => theme.palette.primary.main,
      borderRadius: '50%',
      ...props.sx,
    }}/>
  </Animation>
}

const getAnimationSymbol = (type: AnimationType, speed: AnimationSpeed) => {
  return <AnimationCircle type={type} speed={speed}/>
}

export class AnimationEditor extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
  }

  handleTypeChange(event: any) {
    this.props.onChange(new AnimationEncoding({
      ...this.props.encoding,
      type: event.target.value as AnimationType,
    }))
  }

  handleSpeedChange(event: any) {
    this.props.onChange(new AnimationEncoding({
      ...this.props.encoding,
      speed: event.target.value as AnimationSpeed,
    }))
  }

  handleFieldChange(field?: string) {
    const animation = this.props.encoding
    const reverse = animation.getTestReverse()
    const condition = field ? {test: {field, reverse}} : undefined
    this.props.onChange(new AnimationEncoding({
      ...animation,
      condition,
    }))
  }

  handleReverseChange(event) {
    const reverse = event.target.checked
    const animation = this.props.encoding
    const field = animation.getTestField() ?? ''
    const condition = {test: {field, reverse}}
    this.props.onChange(new AnimationEncoding({
      ...animation,
      condition,
    }))
  }

  handleEnabledChange(enabled: boolean) {
    const animation = this.props.encoding
    this.props.onChange(new AnimationEncoding({
      ...animation,
      enabled,
      type: this.props.encoding.type ?? getTypeOptions(this.props.layerType)[0]?.value as AnimationType,
    }))
  }

  render() {
    const animation = this.props.encoding

    const field = animation.getTestField() ?? ''
    const reverse = animation.getTestReverse()
    const type = animation.type ?? AnimationType.pulse
    const speed = animation.speed ?? DEFAULT_ANIMATION_SPEED

    if (this.props.layerType === LayerType.line && this.props.visualizationType === VisualizationType.CHART) {
      return <></>
    }

    return (<PanelGroup
        title={i18n('ENABLE')}
        canBeEnabled={true}
        enabled={animation.enabled}
        onEnabledChange={this.handleEnabledChange.bind(this)}
        inline
      >
        <FieldEditor
          options={this.props.fieldOptions}
          layout="inline"
          title={i18n('CONDITION')}
          field={field}
          columns={this.props.layerQueryColumns}
          includeNullOption={true}
          nullOptionLabel={i18n('ANIMATE_ALL_ROWS')}
          onChange={this.handleFieldChange.bind(this)}
          required={false}
          helperText={i18n('ANIMATION_CONDITION_HELPER')}
        />
        {field && <PanelField
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
              checked={reverse}
              onChange={this.handleReverseChange.bind(this)}
            />
          </Box>
        </PanelField>}
        {!(this.props.layerType === LayerType.line) && <PanelField
          layout="inline"
          title={i18n('TYPE')}
        >
          <Select
            value={animation.type}
            options={getTypeOptions(this.props.layerType, type)}
            onChange={this.handleTypeChange.bind(this)}
            enableCustomization={true}
            renderOption={(props, option) => {
              return <MenuItem
                key={option.label}
                component="li"
                {...props}
                value={option.value}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '.5em',
                }}>
                {getAnimationSymbol(option.value, speed)}
                <Box>{option.label}</Box>
              </MenuItem>
            }}
          />
        </PanelField>}
        <PanelField
          layout="inline"
          title={i18n('SPEED')}
          sx={{
            paddingBlockStart: '0.5em',
          }}
        >
          <Slider
            min={MIN_ANIMATION_SPEED}
            max={MAX_ANIMATION_SPEED}
            value={speed}
            onChange={this.handleSpeedChange.bind(this)}
            valueLabelDisplay="auto"
          />
        </PanelField>
      </PanelGroup>
    )
  }
}
