import { IdentityProjector } from './IdentityProjector'

test('should project points', () => {
  expect(new IdentityProjector().project([1, 1])).toEqual([1, 1])
  expect(new IdentityProjector().project([1656711207, 1])).toEqual([1656711207, 1])
  expect(new IdentityProjector().project([1, 1, 1])).toEqual([1, 1, 1])
})

test('should unproject points', () => {
  expect(new IdentityProjector().unproject([10, 10])).toEqual([10, 10])
  expect(new IdentityProjector().unproject([1656711207, 10])).toEqual([1656711207, 10])
  expect(new IdentityProjector().unproject([1, 1, 1])).toEqual([1, 1, 1])
})
