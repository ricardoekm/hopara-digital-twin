import { Row } from '@hopara/dataset'
import { URLStringTemplate } from './URLStringTemplate'

it('should parse relative path', () => {
  const string = '/my-path/with/:row-var'
  const url = new URLStringTemplate(string)
  expect(url.getValue()).toEqual(string)
  expect(url).toEqual({
    origin: '',
    hash: '',
    host: '',
    hostname: '',
    pathname: '/my-path/with/:row-var',
    port: '',
    protocol: '',
    search: '',
  })
})

it('should parse full path', () => {
  const string = 'https://mydomain:8000/my-path/with/:row-var?query=123&query2=123#1123123'
  const url = new URLStringTemplate(string)
  expect(url.getValue()).toEqual(string)
  expect(url).toEqual({
    origin: 'https://mydomain:8000',
    hash: '#1123123',
    host: 'mydomain:8000',
    hostname: 'mydomain',
    pathname: '/my-path/with/:row-var',
    port: '8000',
    protocol: 'https',
    search: '?query=123&query2=123',
  })

  const string2 = 'https://mydomain:8000/my-path/with/:row-var?query=123&query2=123#1123123'
  const url2 = new URLStringTemplate(string2)
  expect(url2.getValue()).toEqual(string2)
  expect(url2).toEqual({
    origin: 'https://mydomain:8000',
    hash: '#1123123',
    host: 'mydomain:8000',
    hostname: 'mydomain',
    pathname: '/my-path/with/:row-var',
    port: '8000',
    protocol: 'https',
    search: '?query=123&query2=123',
  })
})

it('should replace with row values', () => {
  const string = '/my-path/:column1/:column2?param=:column3&:column4=:column5'
  const url = new URLStringTemplate(string)
  expect(url.getCompiledValue(new Row({
    column1: 'value1',
    column2: 'value2',
    column3: 'value3',
    column4: 'value4',
    column5: 'value5',
  }))).toEqual('/my-path/value1/value2?param=value3&value4=value5')

  const string2 = 'https://mydomain.com/my-path/:column1/:column2?param=:column3&:column4=:column5'
  const url2 = new URLStringTemplate(string2)
  expect(url2.getCompiledValue(new Row({
    column1: 'value1',
    column2: 'value2',
    column3: 'value3',
    column4: 'value4',
    column5: 'value5',
  }))).toEqual('https://mydomain.com/my-path/value1/value2?param=value3&value4=value5')

  const string3 = 'https://mydomain.com/my-path/:column1/:column2/:unknownColumn?param=:column3&:column4=:column5'
  const url3 = new URLStringTemplate(string3)
  expect(url3.getCompiledValue(new Row({
    column1: 'value1',
    column2: 'value2',
    column3: 'value3',
    column4: 'value4',
    column5: 'value5',
  }))).toEqual('https://mydomain.com/my-path/value1/value2/?param=value3&value4=value5')
})
