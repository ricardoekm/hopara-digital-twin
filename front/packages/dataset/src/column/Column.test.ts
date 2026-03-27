import {Column} from './Column'

test('get label', () => {
  const columnA = new Column({name: 'column_a'})
  const columnC = new Column({name: 'columnC'})
  const columnD = new Column({name: 'COLUMN_D'})

  expect(columnA.getLabel()).toStrictEqual('Column a')
  expect(columnC.getLabel()).toStrictEqual('Column c')
  expect(columnD.getLabel()).toStrictEqual('COLUMN_D')
})

test('private column', () => {
  const columnA = new Column({name: 'publicColumn'})
  const columnB = new Column({name: '_privateColumn'})

  expect(columnA.isPrivate()).toBeFalsy()
  expect(columnB.isPrivate()).toBeTruthy()
})

