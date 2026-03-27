import Visualization from './Visualization'

test('simple parse test', () => {
  const plain = {name: 'Test'}
  const visualization = new Visualization(plain)
  expect(visualization.name).toEqual('Test')
})
