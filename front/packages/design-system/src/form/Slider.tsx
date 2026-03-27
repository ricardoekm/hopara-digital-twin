import React from 'react'
import MuiSlider, {SliderProps, SliderThumb} from '@mui/material/Slider'
import {isNil, omit} from 'lodash/fp'
import {Box} from '@mui/material'
import {i18n} from '@hopara/i18n'
import {Icon} from '../icons/Icon'
import { Tooltip } from '../tooltip/Tooltip'

export enum ThumbFormat {
  CIRCLE,
  RECTANGLE,
  LINK,
  HALF_LEFT_CIRCLE,
  HALF_RIGHT_CIRCLE,
}

const hoparaSliderThumb = (
  thumbFormats?: ThumbFormat[],
  draggingThumbIndex?: number,
  value?: number | number[],
  valueLabelDisplay?: SliderProps['valueLabelDisplay'],
  valueLabelFormat?: SliderProps['valueLabelFormat'],
) => {
  return (props: any): React.ReactElement => {
    const thumbIndex = props['data-index']
    const localProps: any = {...props, style: {...props.style}}

    if (!isNil(draggingThumbIndex) && thumbIndex !== draggingThumbIndex) {
      localProps.sx = {pointerEvents: 'none'}
    }

    const circleProps = {
      ...localProps,
    }

    const halfLeftCircleProps = {
      ...localProps,
      sx: {
        ...localProps.sx,
        width: 10,
        borderRadius: '10rem 0 0 10rem',
      },
    }

    const halfRightCircleProps = {
      ...localProps,
      sx: {
        ...localProps.sx,
        width: 10,
        borderRadius: '0 10rem 10rem 0',
      },
    }

    const rectangleProps = {
      ...localProps,
      sx: {
        ...localProps.sx,
        borderRadius: 0,
        border: 0,
        width: 5,
      },
    }

    let thumbProps

    if (!thumbFormats || thumbFormats.length === 0) thumbProps = circleProps
    else {
      const format = thumbFormats[props['data-index']]
      if (format === ThumbFormat.CIRCLE) {
        thumbProps = circleProps
      } else if (format === ThumbFormat.LINK) {
        thumbProps = {
          ...circleProps,
          sx: {backgroundColor: '#ddd', border: '2px solid #ccc'},
        }
      } else if (format === ThumbFormat.HALF_RIGHT_CIRCLE) {
        thumbProps = halfRightCircleProps
      } else if (format === ThumbFormat.HALF_LEFT_CIRCLE) {
        thumbProps = halfLeftCircleProps
      } else {
        thumbProps = rectangleProps
      }
    }

    // Compute tooltip title based on current value and provided formatter
    let tooltipTitle: React.ReactNode | undefined = undefined
    if (valueLabelDisplay && valueLabelDisplay !== 'off') {
      const currentValue = Array.isArray(value) ? value?.[thumbIndex] : value
      tooltipTitle = valueLabelFormat ? (valueLabelFormat as any)(currentValue, thumbIndex) : currentValue
    }

    // Open tooltip on drag for active thumb; keep default hover behavior for 'auto'
    const isDraggingActiveThumb = !isNil(draggingThumbIndex) && thumbIndex === draggingThumbIndex
    const forceOpen = valueLabelDisplay === 'on' || isDraggingActiveThumb
    const disableHover = valueLabelDisplay === 'off' || isDraggingActiveThumb

    const thumbBody = thumbFormats?.length && thumbFormats[props['data-index']] === ThumbFormat.LINK ? (
      <SliderThumb {...thumbProps} onChange={() => ({})}>
        {props.children}
        <Box sx={{padding: 3}}>
          <Icon icon="link"/>
        </Box>
      </SliderThumb>
    ) : (
      <SliderThumb {...thumbProps}>
        {props.children}
      </SliderThumb>
    )

    // Wrap thumb with Tooltip rendered through Portal to avoid clipping by overflow
    if (tooltipTitle !== undefined) {
      return (
        <Tooltip
          title={tooltipTitle as any}
          placement="top"
          // Use Popper in a portal and allow flipping to keep it visible
          slotProps={{
            popper: {
              disablePortal: false,
              keepMounted: true,
              modifiers: [
                {name: 'preventOverflow', options: {padding: 8}},
                {name: 'flip', options: {fallbackPlacements: ['bottom', 'top']}},
                {name: 'offset', options: {offset: [0, 6]}},
              ],
            } as any,
          }}
          disableHoverListener={disableHover}
          disableFocusListener={forceOpen}
          disableTouchListener={forceOpen}
          enterDelay={0}
          enterNextDelay={0}
          leaveDelay={0}
          TransitionProps={forceOpen ? {timeout: 0} as any : undefined}
          // When forceOpen is true we control the tooltip; otherwise keep default (hover/focus)
          {...(forceOpen ? {open: true} : {})}
        >
          {thumbBody}
        </Tooltip>
      )
    }

    return thumbBody
  }
}

interface Props extends SliderProps {
  thumbFormats?: ThumbFormat[]
  max: number
  min: number
  indicator?: number
}

export const Slider = (props: Props) => {
  const [draggingThumb, setDraggingThumb] = React.useState<number | undefined>(undefined)
  const thumbComponent = hoparaSliderThumb(
    props.thumbFormats,
    draggingThumb,
    props.value as any,
    props.valueLabelDisplay,
    props.valueLabelFormat,
  )
  const omited = omit(['thumbFormats', 'valueLabelDisplay', 'valueLabelFormat'], props)

  let indicator
  if (!isNil(props.indicator)) {
    const delta = (props.max ?? 100) - (props.min ?? 0)
    const indicatorPosition = (props.indicator - (props.min ?? 0)) / delta * 100

    indicator = (
      <Tooltip title={`${i18n('CURRENT_ZOOM')} ${props.indicator}`} placement="bottom"
               disableHoverListener={!isNil(draggingThumb)}>
        <Box sx={{
          position: 'relative',
          left: `${indicatorPosition}%`,
          width: 0,
          height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderBottom: '7px solid transparent',
          borderBottomColor: 'primary.main',
          backgroundColor: 'transparent',
          marginLeft: '-7px',
          borderRadius: 0,
          top: -15,
        }}/>
      </Tooltip>
    )
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      justifyItems: 'center',
      }}>
      <MuiSlider
        {...omited}
        max={props.max}
        min={props.min}
        components={{Thumb: thumbComponent}}
        onChange={(event, value, activeThumb) => {
          setDraggingThumb(activeThumb)
          return props.onChange && props.onChange(event, value, activeThumb)
        }}
        onChangeCommitted={(event, value) => {
          setDraggingThumb(undefined)
          return props.onChangeCommitted && props.onChangeCommitted(event, value)
        }}
      />
      {indicator}
    </Box>
  )
}
