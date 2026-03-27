import React from 'react'
import { PureComponent } from '@hopara/design-system'
import { ColorPicker } from '@hopara/design-system/src/color-picker/ColorPicker'
import { Box, IconButton, Typography } from '@mui/material'
import { Row } from '@hopara/dataset'
import { ObjectSizeEditor } from './ObjectSizeEditor'
import { Data, SizeEncoding, SizeUnits } from '@hopara/encoding'
import { i18n } from '@hopara/i18n'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import { Tooltip } from '@hopara/design-system/src/tooltip/Tooltip'

export type StateProps = {
  canSetColor?: boolean
  canSetSize?: boolean
  colorValue?: string
  sizeUnits: SizeUnits
  maxSize?: number
  sizeEncoding: SizeEncoding
  rowsetId: string
  positionData: Data
  row: Row
  zoom: number
}

export type ActionProps = {
  onColorChange: (value?:string) => void
  onResetColor: () => void
  onSizeChange: (value:number) => void
  onResetSize: () => void
  onViewChange: (value?: string) => void
}

export class ObjectAppearanceEditor extends PureComponent<StateProps & ActionProps> {
  renderColorEditor() {
    return (
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: 4,
        alignItems: 'center',
      }}>
        <Typography sx={{
            lineHeight: 1.5,
            padding: '8px 0px',
            fontWeight: '500',
            border: 'none',
            whiteSpace: 'nowrap',
            opacity: 0.66,
            fontSize: 12,
            width: 'max-content',
            minWidth: '8ch',
        }}>
          {i18n('COLOR')}
        </Typography>
        <ColorPicker
          value={this.props.colorValue}
          onChange={this.props.onColorChange.bind(this)}
          onPreview={this.props.onColorChange.bind(this)}
        />
        <Tooltip title={i18n('RESET_COLOR')} placement='top' disableInteractive>
          <IconButton onClick={this.props.onResetColor.bind(this)}>
            <Icon icon='reset'/>
          </IconButton>
        </Tooltip>
      </Box>
    )
  }

  renderSizeEditor() {
    return (
      <Box sx={{
        gridRowStart: 'span 1',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: 12,
        alignItems: 'center',
      }}>
        <Typography sx={{
            lineHeight: 1.5,
            padding: '8px 0px',
            fontWeight: '500',
            border: 'none',
            whiteSpace: 'nowrap',
            opacity: 0.66,
            fontSize: 12,
            width: 'max-content',
            minWidth: '8ch',
        }}>
          {i18n('SIZE')}
        </Typography>
        <ObjectSizeEditor
          onChange={this.props.onSizeChange.bind(this)}
          units={this.props.sizeUnits}
          zoom={this.props.zoom}
          maxSize={this.props.maxSize}
          encoding={this.props.sizeEncoding}
        />
        <Tooltip title={i18n('RESET_SIZE')} placement='top' disableInteractive>
        <IconButton onClick={this.props.onResetSize.bind(this)}>
          <Icon icon='reset'/>
        </IconButton>
        </Tooltip>
      </Box>
    )
  }

  render() {
    return (
      <Box sx={{
        marginInline: 12,
        paddingBlock: 12,
        display: 'grid',
        gap: 12,
      }}>
          {this.props.canSetColor && this.renderColorEditor()}
          {this.props.canSetSize && this.renderSizeEditor()}
      </Box>
    )
  }
}
