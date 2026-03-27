import React, {useMemo} from 'react'
import dayjs from 'dayjs'
import {Config} from '@hopara/config'
import {PanelField} from '../panel/PanelField'
import {NativeDateTimePicker} from './NativeDateTimePicker'
import {MuiDateTimePicker} from './MuiDateTimePicker'
import {Box} from '@mui/material'

export const DateTimePanelCardField = (props: {
  title: string,
  date?: string,
  onChange: (date: string) => void,
  locale: string,
}) => {
  const native = useMemo(() => Config.getValueAsBoolean('IS_TOUCH_DEVICE') || Config.getValueAsBoolean('IS_SMALL_HEIGHT_SCREEN'), [])
  const newProps = {
    date: '',
    time: '',
    onChange: props.onChange,
    locale: props.locale,
  }
  if (props.date) {
    newProps.date = dayjs(props.date).format('YYYY-MM-DD')
    newProps.time = dayjs(props.date).format('HH:mm')
  }
  return <PanelField
    title={props.title}
    layout="inline"
    sx={{
      gridTemplateColumns: '50px auto',
    }}
  >
    <Box sx={{
      display: 'grid',
      gridAutoFlow: 'column',
      gridTemplateColumns: 'auto 100px',
      gap: 4,
    }}>
      {native ? <NativeDateTimePicker {...newProps} /> : <MuiDateTimePicker {...newProps} />}
    </Box>
  </PanelField>
}
