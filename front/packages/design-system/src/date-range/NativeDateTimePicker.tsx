import React from 'react'
import dayjs from 'dayjs'
import {TextField} from '../form'

export const NativeDateTimePicker = (props: { date: string, time: string, onChange: (newDate: string) => void }) => {
  return <>
    <TextField
      type="date"
      sx={{flex: 1}} value={props.date}
      onChange={(event) => {
        const newDate = dayjs(event.target.value + 'T' + props.time)
        props.onChange(newDate.toISOString())
      }}/>
    <TextField
      type="time"
      value={props.time}
      onChange={(event) => {
        const newDate = dayjs(props.date + 'T' + event.target.value)
        props.onChange(newDate.toISOString())
      }}/>
  </>
}
