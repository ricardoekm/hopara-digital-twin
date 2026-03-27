import {Authorization} from './Authorization'

test('validate if user authorization can edit visualization', () => {
  const authorizationUnauthorized = new Authorization({
    permissions: [],
  } as any)
  expect(authorizationUnauthorized.canEditVisualization()).toBeFalsy()
  const authorizationAuthorized = new Authorization({
    permissions: ['app:write'],
  } as any)
  expect(authorizationAuthorized.canEditVisualization()).toBeTruthy()
})

test('validate if user authorization can edit row', () => {
  const authorizationUnauthorized = new Authorization({
    permissions: [],
  } as any)
  expect(authorizationUnauthorized.canEditRow()).toBeFalsy()
  const authorizationAuthorized = new Authorization({
    permissions: ['row:write'],
  } as any)
  expect(authorizationAuthorized.canEditRow()).toBeTruthy()
})
