import {styled, Theme} from '../theme'
import {alpha, Box, IconButton, Popover} from '@mui/material'
import React from 'react'
import {TextField} from '../form'
import {Icon} from '../icons/Icon'
import {PureComponent} from '../component/PureComponent'
import {DebouncedFunc} from 'lodash'
import {debounce} from 'lodash/fp'

const ColorPickerStyle = styled(Box, {name: 'ColorPicker'})({
  height: '38px',
  position: 'relative',
})

const ColorPickerSelect = styled(Box, {name: 'ColorPickerSelect'})((props: { theme: Theme }) => ({
  ...props.theme.components.HoparaInput,
  'padding': 5,
  'cursor': 'pointer',
  'height': '38px',
  'display': 'flex',
  'alignItems': 'center',
  'width': '100%',
  '&:hover': {
    backgroundColor: props.theme.palette.spec.inputBackgroundHover,
  },
}))

const OptionBorder = styled('button', {name: 'SwatchBorder'})((props: { theme: Theme }) => ({
  'cursor': 'pointer',
  'borderRadius': 12,
  'padding': 1,
  'borderStyle': 'solid',
  'borderWidth': 1,
  'borderColor': 'transparent',
  'backgroundColor': 'transparent',
  'marginTop': 1,
  'marginBottom': 1,
  '&.selected': {
    'borderColor': alpha(props.theme.palette.primary.main, 1),
  },
  '&.preview': {
    'borderColor': alpha(props.theme.palette.primary.main, 0.6),
  },
}))

const ArrowAdornment = styled(Box, {name: 'ArrowAdornment'})({
  width: 30,
  display: 'flex',
})

const ColorGrid = styled(Box, {name: 'ColorGrid'})(() => ({
  display: 'grid',
  gridTemplateColumns: 'var(--grid)',
}))

const PopoverContent = styled(Box, {name: 'PopoverContent'})({
  padding: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: '1em',
  minWidth: 200,
  maxWidth: 200,
})

export const SwatchBase = styled(Box, {name: 'SwatchBase'})({
  height: 18,
  borderRadius: 10,
  border: '1px solid rgba(0,0,0,0.15)',
  flex: 1,
})

interface Props {
  value?: string
  previewValue?: string
  default: string
  width?: number
  optionRender: (value: string) => React.ReactNode
  onChange: (value: string) => void
  onPreview?: (value: string | undefined) => void
  options: string[]
  grid?: boolean
  popperAdornment?: React.ReactNode
  testId?: string
}

export class ColorPickerBase extends PureComponent<Props, {
  isOpen: boolean;
  anchorEl: HTMLElement | null;
}> {
  previewDebounced?: DebouncedFunc<(value: string | undefined) => void>

  constructor(props: Props) {
    super(props)
    this.state = {
      isOpen: false,
      anchorEl: null,
    }

    if (this.props.onPreview) this.previewDebounced = debounce(50, this.props.onPreview)
  }

  handleClose() {
    this.setState({isOpen: false, anchorEl: null})
    if (this.props.onPreview) this.props.onPreview(undefined)
  }

  handleColorHover(value: string, event: any) {
    event.preventDefault()
    event.stopPropagation()
    if (!this.state.isOpen) return
    if (this.previewDebounced) this.previewDebounced(value)
  }

  handlePickerClick(event: React.MouseEvent<HTMLElement>) {
    if (this.previewDebounced) this.previewDebounced.cancel()
    this.setState({
      isOpen: !this.state.isOpen,
      anchorEl: event.currentTarget,
    })
  }

  handleChange(value: string) {
    if (value !== this.props.value) {
      this.props.onChange(value)
    }
  }

  handleClick(value: string, event: any) {
    event.preventDefault()
    event.stopPropagation()

    if (this.previewDebounced) this.previewDebounced.cancel()

    this.setState({isOpen: false, anchorEl: null})
    this.handleChange(value)
  }

  render() {
    return (
      <ColorPickerStyle sx={{width: this.props.width}}>
        <ColorPickerSelect
          onClick={this.handlePickerClick.bind(this)}
          data-testid={this.props.testId}
        >
          {this.props.optionRender(this.props.value!)}
          <ArrowAdornment>
            <IconButton size="small" sx={{padding: 0, margin: 'auto'}}>
              <Icon icon={this.state.isOpen ? 'menu-up' : 'menu-down'}/>
            </IconButton>
          </ArrowAdornment>
        </ColorPickerSelect>

        <Popover
          open={this.state.isOpen}
          anchorEl={this.state.anchorEl}
          onClose={this.handleClose.bind(this)}
          transitionDuration={0}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              marginTop: 1,
              backgroundColor: (theme: any) => theme.palette.spec.backgroundPanel,
              backdropFilter: (theme: any) => theme.palette.spec.backgroundBlur,
              borderRadius: '10px',
              boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 5px -1px',
            },
          }}
        >
          <PopoverContent>
            {this.props.popperAdornment}
            <ColorGrid sx={{'--grid': this.props?.grid ? '1fr 1fr 1fr 1fr' : '1fr'}}>
              {this.props.options.map((option, i) => (
                <OptionBorder
                  key={i}
                  className={`
                    ${option === this.props.value ? 'selected' : ''}
                    ${option === this.props.previewValue ? 'preview' : ''}
                  `}
                  data-testid='color-button'
                  onClick={(e) => this.handleClick(option, e)}
                  onFocus={(e) => this.handleColorHover(option, e)}
                  onMouseEnter={(e) => this.handleColorHover(option, e)}
                >
                  {this.props.optionRender(option)}
                </OptionBorder>
              ))}
            </ColorGrid>
            <TextField
              data-testid='text-color-hex'
              placeholder="hex"
              value={this.props.previewValue || this.props.value}
              onChange={(e) => this.handleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Tab') {
                  this.setState({isOpen: false, anchorEl: null})
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </ColorPickerStyle>
    )
  }
}
