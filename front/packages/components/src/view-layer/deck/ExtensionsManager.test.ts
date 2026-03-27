import { ExtensionType, ExtensionsManager } from './ExtensionsManager'

test('Add extension', () => {
  const extensions = ExtensionsManager.add([], ExtensionType.offset)
  expect(extensions.length).toEqual(1)
})

test('Create array if undefined', () => {
  const extensions = ExtensionsManager.add(undefined as any, ExtensionType.offset)
  expect(extensions.length).toEqual(1)
})

test('Do not add twice', () => {
  const extensions = ExtensionsManager.add([], ExtensionType.offset)
  const extensions2 = ExtensionsManager.add(extensions, ExtensionType.offset)
  expect(extensions2.length).toEqual(1)
})

test('add two extensions', () => {
  const extensions = ExtensionsManager.add([], ExtensionType.offset)
  const extensions2 = ExtensionsManager.add(extensions, ExtensionType.precision)
  expect(extensions2.length).toEqual(2)
})
