import {getContinuousSchemes, getDiscreteSchemes} from '@hopara/encoding/src/color/Schemes'
import {ColorPickerBase, SwatchBase} from './ColorPickerBase'
import {Box} from '@mui/material'
import React from 'react'
import {styled} from '../theme'
import {PureComponent} from '../component/PureComponent'
import { isNil } from 'lodash/fp'

const discreteSchemes = getDiscreteSchemes()
const continuousSchemes = getContinuousSchemes(8)

export const schemes = {
  ...continuousSchemes,
  ...discreteSchemes,
}

const SchemeSwatch = styled(SwatchBase, {name: 'Swatch'})({
  display: 'flex',
  overflow: 'hidden',
})

interface Props {
  value?: string
  previewValue?: string
  range?: string[]
  reverse: boolean
  onSchemeChange: (scheme: string | undefined) => void
  onSchemePreview?: (scheme: string | undefined) => void
}

const CUSTOM_SCHEME_KEY = 'customized'

export class ColorSchemePicker extends PureComponent<Props> {
  isCustom(): boolean {
    return !!this.props.range?.length
  }

  render() {
    const localSchemes = this.isCustom() ? {[CUSTOM_SCHEME_KEY]: this.props.range, ...schemes} : schemes
    const schemeNames = Object.keys(localSchemes)
    const value = this.isCustom() && isNil(this.props.value) ? CUSTOM_SCHEME_KEY : this.props.value

    return <ColorPickerBase
    value={value}
    previewValue={this.props.previewValue}
    options={schemeNames}
    default={schemeNames[0]}
    optionRender={(value) => {
      const scheme = localSchemes[value]
      let colors = []
      if (scheme) {
        colors = this.props.reverse ? [...scheme].reverse() : localSchemes[value]
      }

      return <SchemeSwatch>
        {colors.map((backgroundColor, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor,
              flex: 1,
            }}/>
        ))}
      </SchemeSwatch>
    }}
    onChange={(value) => {
      this.props.onSchemeChange(value === CUSTOM_SCHEME_KEY ? undefined : value)
    }}
    onPreview={(value) => {
      if (this.props.onSchemePreview) this.props.onSchemePreview(value)
    }}
  />
  }
}
