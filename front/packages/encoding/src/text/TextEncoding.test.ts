import { ColumnType } from '@hopara/dataset'
import { MaxLengthType, TextEncoding } from './TextEncoding'

jest.mock('@hopara/internals', () => ({
  Logger: {
    error: (props) => (props),
  },
}))

test('Prefix', () => {
  const row = {nome: 'Jose'}
  const textEncoding = new TextEncoding({field: 'nome', prefix: { value: 'Sr. ' }})
  expect(textEncoding.getValue(row)).toEqual('Sr. Jose')
})

test('Prefix works with fixed value', () => {
  const row = {}
  const textEncoding = new TextEncoding({value: 'Jose', prefix: { value: 'Sr. ' }})
  expect(textEncoding.getValue(row)).toEqual('Sr. Jose')
})


test('Replaces \\n by line break', () => {
  const row = {nome: 'Jose\\nAlves'}
  const textEncoding = new TextEncoding({field: 'nome'})
  expect(textEncoding.getValue(row)).toEqual('Jose\nAlves')
})

test('Prefix with field', () => {
  const row = {nome: 'Jose', tratamento: 'Sr.', sobrenome: 'Almeida'}
  const textEncoding = new TextEncoding({field: 'nome', prefix: { field: 'tratamento' }, suffix: { field: 'sobrenome' }})
  expect(textEncoding.getValue(row)).toEqual('Sr. Jose Almeida')
})

test('Suffix', () => {
  const row = {nome: 'Jose'}
  const textEncoding = new TextEncoding({field: 'nome', suffix: { value: ' Terceiro' }})
  expect(textEncoding.getValue(row)).toEqual('Jose Terceiro')
})

test('Value', () => {
  const row = {}
  const textEncoding = new TextEncoding({field: 'nome', value: 'Sem Nome'})
  expect(textEncoding.getValue(row)).toEqual('Sem Nome')
})

test('Map', () => {
  const row = {nome: 'Ricardo'}
  const map = {Ricardo: 'Galo'}
  const textEncoding = new TextEncoding({field: 'nome', map})
  expect(textEncoding.getValue(row)).toEqual('Galo')
})

test('Map works with numbers', () => {
  const row = {nome: 2.0}
  const map = {2.0: 'Galo'}
  const textEncoding = new TextEncoding({field: 'nome', map})
  expect(textEncoding.getValue(row)).toEqual('Galo')
})

test('Key map as string', () => {
  const row = {nome: 2.0}
  const map = {'2': 'Galo'}
  const textEncoding = new TextEncoding({field: 'nome', map})
  expect(textEncoding.getValue(row)).toEqual('Galo')
})

test('Key map as string 2', () => {
  const row = {nome: 2.1}
  const map = {'2.1': 'Galo'}
  const textEncoding = new TextEncoding({field: 'nome', map})
  expect(textEncoding.getValue(row)).toEqual('Galo')
})

test('Max length', () => {
  const row = {nome: '123456'}
  const textEncoding = new TextEncoding({field: 'nome', maxLength: { value: 3, type: MaxLengthType.FIXED }})
  expect(textEncoding.getValue(row)).toEqual('123…')
})

test('Complex field', () => {
  const row = {metric: { vibration: 10} }
  const textEncoding = new TextEncoding({field: 'metric.vibration', format: ',.2f'})
  expect(textEncoding.getValue(row)).toEqual('10.00')
})

test('Complex field notation with simple field should return ull', () => {
  const row = {metric: 10 }
  const textEncoding = new TextEncoding({field: 'metric.vibration', format: ',.2f'})
  expect(textEncoding.getValue(row)).toBeUndefined()
})

test('Format', () => {
  const row = {vendas: 1000.003}
  const textEncoding = new TextEncoding({field: 'vendas', format: ',.2f'})
  expect(textEncoding.getValue(row)).toEqual('1,000.00')
})

test('Invalid format ignores format', () => {
  const row = {vendas: 1000.003}
  const textEncoding = new TextEncoding({field: 'vendas', format: 'bla'})
  expect(textEncoding.getValue(row)).toEqual('1000.003')
})

test('Invalid format ignores format', () => {
  const row = {vendas: 1000.003}
  const textEncoding = new TextEncoding({field: 'vendas', format: 'bla'})
  expect(textEncoding.getValue(row)).toEqual('1000.003')
})
/*
test('Format date', () => {
  const row = {data: new Date(1656112829000)}

  const textEncoding = new TextEncoding({field: 'data', format: '%d/%b/%Y %H:%m'})
  const formattedText = textEncoding.getValue(row, ColumnType.DATETIME)

  expect(formattedText.startsWith('24/Jun/2022 ')).toBeTruthy()
  expect(formattedText.endsWith(':06')).toBeTruthy()
})*/

test('Format 0 integer', () => {
  const row = {temperature: 0}

  const textEncoding = new TextEncoding({field: 'temperature'})
  expect(textEncoding.getValue(row, ColumnType.INTEGER)).toEqual('0')
})

test('Format boolean value', () => {
  const row = {legal: true}

  const textEncoding = new TextEncoding({field: 'legal'})
  expect(textEncoding.getValue(row, ColumnType.BOOLEAN)).toEqual('true')
})
