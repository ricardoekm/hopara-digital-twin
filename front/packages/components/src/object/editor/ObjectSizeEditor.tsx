import React from 'react'
import { Slider } from '@hopara/design-system/src/form'
import { BaseSizeEditor, BaseStateProps } from '../../layer/editor/size/BaseSizeEditor'

export interface ActionsProps {
  onChange: (value: number) => void
}

export class ObjectSizeEditor extends BaseSizeEditor<BaseStateProps & ActionsProps> {
  onChange(event:any) {
    const value = Number(event.target.value) / this.props.encoding.getMultiplier()
    this.props.onChange(value)
  }

  render() {
    return (
      <Slider
        value={Math.round(this.getPixelsValue())}
        onChange={this.onChange.bind(this)}
        min={this.getMinSize()}
        max={this.getMaxSize()}
        step={this.getStepSize()}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => value.toFixed(0)} />
    )
  }
}
