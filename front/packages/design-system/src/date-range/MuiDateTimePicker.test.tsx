import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react'
import {provideTheme} from '../provide-theme'
import {MuiDateTimePicker} from './MuiDateTimePicker'

describe('MuiDateTimePicker', () => {
  it('Should update date', async () => {
    let date
    const props = {
      date: '2020-01-01',
      time: '00:00',
      onChange: (d) => {
        date = d
      },
      locale: 'en',
    }
    const element = render(provideTheme(<MuiDateTimePicker {...props} />))
    const inputs = element.baseElement.querySelectorAll<HTMLInputElement>('input')
    fireEvent.change(inputs[0], {target: {value: '01/03/2000'}})
    await waitFor(() => {
      expect(date).toEqual(new Date('2000-01-03T00:00:00').toISOString())
    })
  })

  it('should update time', () => {
    let date
    const props = {
      date: '2020-01-01',
      time: '00:00',
      onChange: (d) => {
        date = d
      },
      locale: 'en',
    }
    const element = render(provideTheme(<MuiDateTimePicker {...props} />))
    const inputs = element.baseElement.querySelectorAll<HTMLInputElement>('input')
    fireEvent.change(inputs[1], {target: {value: '01:00 PM'}})
    expect(date).toEqual(new Date('2020-01-01T13:00:00').toISOString())
  })
})
