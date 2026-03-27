import { getDomain } from './Domain'

test('Get domain from email', () => {
  expect(getDomain('ricardo@hopara.io')).toEqual('hopara.io')
})

test('If it not an email return just the domain', () => {
  expect(getDomain('hopara.io')).toEqual('hopara.io')
})
