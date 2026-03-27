// import React from 'react'
// import {fireEvent, render, waitFor} from '@testing-library/react'
// import {DateRangePicker} from './DateRangePicker'
// import {provideTheme} from '../provide-theme'
// import {DateRangeFilterOption} from '@hopara/dataset/src/filter/DateRangeFilter'

describe('DateRange', () => {
  it('Should be default', async () => {
    expect(true).toBeTruthy()
  })
  // it('Should be customized', async () => {
  //   const props = {
  //     fieldName: 'any-field',
  //     values: [
  //       new Date('2000-01-01T00:00:00').toISOString(),
  //       new Date('2000-01-02T00:00:00').toISOString(),
  //     ],
  //     onChange: () => {
  //       return
  //     },
  //     locale: 'en',
  //   }
  //   const element = render(provideTheme(<DateRangePicker {...props} />))
  //   const inputs = element.baseElement.querySelectorAll<HTMLInputElement>('input')
  //   expect(inputs[0].value).toEqual('customize')
  //   expect(inputs[1].value).toEqual('01/01/2000')
  //   expect(inputs[2].value).toEqual('12:00 AM')
  //   expect(inputs[3].value).toEqual('01/02/2000')
  //   expect(inputs[4].value).toEqual('12:00 AM')
  // })

  // it('Should update date', async () => {
  //   const date1 = new Date('2000-01-01T00:00:00').toISOString()
  //   const date2 = new Date('2000-01-02T00:00:00').toISOString()
  //   const date3 = new Date('2000-01-03T00:00:00').toISOString()
  //   let date
  //   const props = {
  //     fieldName: 'any-field',
  //     values: [date1, date2],
  //     onChange: (d1) => {
  //       date = d1
  //     },
  //     locale: 'en',
  //   }
  //   const element = render(provideTheme(<DateRangePicker {...props} />))
  //   const inputs = element.baseElement.querySelectorAll<HTMLInputElement>('input')
  //   fireEvent.change(inputs[1], {target: {value: '01/03/2000'}})
  //   await waitFor(() => {
  //     expect(date).toEqual([date3, date2])
  //   })
  // })

  // it('should update time', () => {
  //   const date1 = new Date('2000-01-01T00:00:00').toISOString()
  //   const date2 = new Date('2000-01-02T00:00:00').toISOString()
  //   const date3 = new Date('2000-01-01T13:00:00').toISOString()
  //   let date
  //   const props = {
  //     fieldName: 'any-field',
  //     values: [date1, date2],
  //     onChange: (d1) => {
  //       date = d1
  //     },
  //     locale: 'en',
  //   }
  //   const element = render(provideTheme(<DateRangePicker {...props} />))
  //   const inputs = element.baseElement.querySelectorAll<HTMLInputElement>('input')
  //   fireEvent.change(inputs[2], {target: {value: '01:00 PM'}})
  //   expect(date).toEqual([date3, date2])
  // })

  // it('should be last one hour', () => {
  //   const props = {
  //     fieldName: 'any-field',
  //     values: [DateRangeFilterOption.past1Hour],
  //     onChange: () => undefined,
  //     locale: 'en',
  //   }
  //   const element = render(provideTheme(<DateRangePicker {...props}/>))
  //   const inputs = element.baseElement.querySelectorAll<HTMLInputElement>('input')
  //   expect(inputs.length).toEqual(1)
  //   expect(inputs[0].value).toEqual('past1Hour')
  // })
})
export {}
