import React from 'react'
import {PureComponent} from '../component/PureComponent'
import {ColorPickerBase, SwatchBase} from './ColorPickerBase'
import {styled} from '../theme'

const colors = [
  '#0D8EF1',
  '#3B9932',
  '#FFDD00',
  '#E41A0C',
  '#FFFFFF',
  '#CCCCCC',
  '#808080',
  '#1A1A1A',
]
const DEFAULT_COLOR = '#ffffff'

const Swatch = styled(SwatchBase, {name: 'Swatch'})(() => ({
  backgroundColor: 'var(--color)',
}))

interface Props {
  value?: string
  previewValue?: string
  width?: number
  onChange: (color: string) => void
  onPreview?: (color: string | undefined) => void
  testId?: string
}

export class ColorPicker extends PureComponent<Props> {
  render() {
    return <ColorPickerBase
      grid
      testId={this.props.testId}
      options={colors}
      default={DEFAULT_COLOR}
      optionRender={(color) => <Swatch sx={{'--color': color ?? DEFAULT_COLOR}}/>}
      {...this.props}
    />
  }
}
