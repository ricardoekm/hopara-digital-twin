import { ELLIPSIS, limitText } from './LimitText'

const ELLIPSIS_TEST_WIDTH = 15

test('Limit horizontally', () => {
  const charCoordinates = {
    y: [
      30, 
      30,
      30,
      90,
      90,
      90,
      150,
      150,
      150,
    ],
    x: [],
  }
  const maxDimensions = {height: 1000, width: 1000}

  const text = '123456789'
  expect(limitText(text, charCoordinates, maxDimensions, ELLIPSIS_TEST_WIDTH)).toEqual('123\n456\n789')
})

test('Respects max height', () => {
  const charCoordinates = {
    y: [
      30,
      30,
      30,
      90,
      90,
      90,
      150,
      150,
      150,
    ],
    x: [],
  }
  const maxDimensions = {height: 100, width: 100}

  const text = '123456789'
  expect(limitText(text, charCoordinates, maxDimensions, ELLIPSIS_TEST_WIDTH)).toEqual(`123\n456${ELLIPSIS}`)
})

test('Remove chars to fit ellipis', () => {
  const charCoordinates = {
    y: [
      30,
      30,
      30,
      90,
      90,
      90,
      150,
      150,
      150,
    ],
    x: [
      0,
      10,
      20,
      0,
      10,
      20,
      0,
      10,
      20,
    ],
  }
  const maxDimensions = {height: 100, width: 30}

  const text = '123456789'
  expect(limitText(text, charCoordinates, maxDimensions, ELLIPSIS_TEST_WIDTH)).toEqual(`123\n4${ELLIPSIS}`)
})
