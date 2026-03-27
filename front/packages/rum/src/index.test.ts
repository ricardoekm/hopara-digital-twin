import { shouldSend } from '.'

test('dont send icon resources', () => {
  const url = 'https://resource.hopara.app/tenant/hopara.io/icon/SAFETY%20CABINET?fallback=machine'
  expect(shouldSend({type: 'resource', resource: {url}})).toBeFalsy()
})

test('send image resources', () => {
  const url = 'https://resource.hopara.app/tenant/hopara.io/image-library/hopara/image/Lab%203?max-size=16384&resolution=md'
  expect(shouldSend({type: 'resource', resource: {url}})).toBeTruthy()
})
