import { Position } from '@deck.gl/core'

export function zSwap(v3: Position) {
  const temp = -v3[1] // negeative y to positive z
  // lineZ = -1
  if (v3[0] === -1) {
    v3[0] = 0
  }
  if (v3[2]) {
    v3[1] = v3[2]
    v3[2] = temp
  }
}
