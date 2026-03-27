import { Resource } from '../resource/Resource'

it('should create resources from file', () => {
  const resources = Resource.fromFiles(['my_file.txt', 'other_file.json'])

  expect(resources).toEqual([
    {'file': 'my_file.txt', 'name': 'my_file'},
    {'file': 'other_file.json', 'name': 'other_file'}])
})
