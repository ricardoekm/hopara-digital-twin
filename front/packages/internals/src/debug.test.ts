import {Debug} from './debug'

it('enable debug', () => {
  Debug.enable()
  expect(Debug.isDebugging()).toBeTruthy()
})
