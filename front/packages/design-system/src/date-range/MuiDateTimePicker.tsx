import React from 'react'
import dayjs from 'dayjs'
import {DatePicker, TimePicker, LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import { useTheme } from '../theme'

interface Props {
  date: string
  time: string
  onChange: (newDate: string) => void
  locale: string
}

const Component = (props: Props) => {
  const theme = useTheme()
  const slotProps = {
    openPickerIcon: {fontSize: 'small'},
    textField: {
      variant: 'filled',
      sx: {
        '& .MuiInputBase-root': {
          'padding': 0,
          '& .MuiInputAdornment-root': {
            'marginLeft': 0,
            '& .MuiIconButton-root': {
              marginRight: 0,
              padding: 8,
            },
          },
        },
      },
      inputProps: {
        style: {
          padding: '8px 0 9px 8px',
        },
      },
    },
    nextButton: {
      sx: {
      },
    },
    previousButton: {
      sx: {
        marginInlineEnd: 12,
      },
    },
    layout: {
      sx: {
        '& .MuiPaper-root': {
          backgroundColor: theme.palette.spec.backgroundPanel,
          borderRadius: '10px',
          padding: '16px',
        },
        '& .MuiPickersCalendarHeader-root': {
          '& .MuiPickersCalendarHeader-label': {
            fontSize: 16,
            color: theme.palette.spec.primary,
            fontWeight: 600,
          },
          'position': 'relative',
        },
        '& .MuiPickersArrowSwitcher-root': {
          gap: 12,
        },
        '& .MuiPickersDay-root': {
          'fontSize': 14,
          'fontWeight': 600,
          'transition': 'none',
          '&:hover': {
            'color': `${theme.palette.primary.main} !important`,
            'fontWeight': 800,
            'backgroundColor': 'transparent !important',
            'border': `1.5px solid ${theme.palette.primary.main} !important`,
          },
          '&.Mui-selected': {
            'backgroundColor': theme.palette.primary.main,
            'color': theme.palette.primary.contrastText,
            'transition': 'none',
            '&:hover': {
              'color': `${theme.palette.primary.contrastText} !important`,
              'backgroundColor': `${theme.palette.primary.main} !important`,
            },
            '&:focus': {
              'color': `${theme.palette.primary.contrastText} !important`,
              'backgroundColor': `${theme.palette.primary.main} !important`,
            },
          },
          '&.MuiPickersDay-today': {
            'border': 'none !important',
            'backgroundColor': `${theme.palette.spec.borderColor} !important`,
          },
        },
        '& .MuiDayCalendar-weekDayLabel': {
          fontSize: 14,
          fontWeight: 700,
          opacity: 0.5,
        },
      },
    },
    popper: {
      sx: {
        '& .MuiPickersPopper-paper': {
          background: theme.palette.spec.backgroundPanel,
          transform: 'none !important',
          transition: 'none !important',
          backdropFilter: theme.palette.spec.backgroundBlur,
          borderRadius: '10px',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 5px -1px',
        },
      },
    },
  } as any

  return <>
    <DatePicker
      value={dayjs(props.date) as any}
      dayOfWeekFormatter={(weekday) => `${weekday.format('ddd')}.`}
      slotProps={slotProps}
      onChange={(newDate) => {
        const [hours, minutes] = props.time.split(':')
        const dateStr = new Date(newDate.year(), newDate.month(), newDate.date(), hours ? parseInt(hours) : 0, minutes ? parseInt(minutes) : 0)
        props.onChange(dateStr.toISOString())
      }}
    />
    <TimePicker
      value={dayjs(`${props.date} ${props.time}`) as any}
      slotProps={slotProps}
      onChange={(newTime) => {
        const [hours, minutes] = newTime.format('HH:mm').split(':')
        props.onChange(dayjs(props.date)
          .set('hour', parseInt(hours))
          .set('minute', parseInt(minutes))
          .toISOString())
      }}
    />
  </>
}

export const MuiDateTimePicker = (props: Props) => {
  return <LocalizationProvider
    dateAdapter={AdapterDayjs}
    adapterLocale={props.locale}
  >
    <Component {...props} />
  </LocalizationProvider>
}
