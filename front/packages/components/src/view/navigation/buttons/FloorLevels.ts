import { isNil } from 'lodash/fp'
import {Floors} from '../../../floor/Floors'
import {Floor} from '../../../floor/Floor'

export const getFloorLevels = (currentFloor: Floor, floors: Floors): Floors => {
  let steps = new Floors()

  if (!floors.length) return steps
  const currentFloorIndex = floors.findIndexByName(currentFloor.name)
  steps = new Floors(...[currentFloor])
  
  if (currentFloorIndex === 0) {
    const nextFloor = floors[currentFloorIndex + 1]
    if (!isNil(nextFloor)) steps.push(nextFloor)
    const nextNextFloor = floors[currentFloorIndex + 2]
    if (!isNil(nextNextFloor)) steps.push(nextNextFloor)
  } else if (currentFloorIndex === floors.length - 1) {
    const prevFloor = floors[currentFloorIndex - 1]
    if (!isNil(prevFloor)) steps.unshift(prevFloor)
    const prevPrevFloor = floors[currentFloorIndex - 2]
    if (!isNil(prevPrevFloor)) steps.unshift(prevPrevFloor)
  } else {
    const nextFloor = floors[currentFloorIndex + 1]
    if (!isNil(nextFloor)) steps.push(nextFloor)
    const prevFloor = floors[currentFloorIndex - 1]
    if (!isNil(prevFloor)) steps.unshift(prevFloor)
  }
  return steps
}

