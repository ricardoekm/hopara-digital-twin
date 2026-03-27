import { HashedScaleBehavior } from './HashedScaleBehavior'

test('Always return the same color value for a given input', () => {
  const behavior = new HashedScaleBehavior()

  const colors = ['#ff0000', '#00ff00', '#0000ff']
  const scale = behavior.getScale(colors)

  expect(scale('freezer')).toEqual('#0000ff')
  expect(scale('incubator')).toEqual('#00ff00')
})


test('Works with numbers', () => {
  const behavior = new HashedScaleBehavior()

  const colors = ['#d32f2f', '#c2185b']
  const scale = behavior.getScale(colors)

  expect(scale(1)).toEqual('#c2185b')
  expect(scale(2)).toEqual('#d32f2f')
})

test('Works with boolean', () => {
  const behavior = new HashedScaleBehavior()

  const colors = ['#d32f2f', '#c2185b']
  const scale = behavior.getScale(colors)

  expect(scale(false)).toEqual('#c2185b')
  expect(scale(true)).toEqual('#d32f2f')
})
