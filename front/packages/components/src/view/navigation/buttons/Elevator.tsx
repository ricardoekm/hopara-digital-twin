import React from 'react'
import {PureComponent} from '@hopara/design-system'
import { CanvasNavigationButton } from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import { CanvasNavigationButtonGroup } from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'
import { i18n } from '@hopara/i18n'
import { getFloorLevels } from './FloorLevels'
import { Floors } from '../../../floor/Floors'
import { Floor } from '../../../floor/Floor'
import { reverse } from 'lodash/fp'
import Visualization from '../../../visualization/Visualization'

export interface StateProps {
  currentFloor: Floor | undefined
  floors: Floors
  visualization?: Visualization
  isOnObjectEditor: boolean
  showFloorSteps: boolean
}

export interface ActionProps {
  onClick: (floor?: Floor) => void
}


export class Elevator extends PureComponent<StateProps & ActionProps> {
  render() {
    if (!this.props.currentFloor ||
        !this.props.floors.length ||
        (this.props.floors.length <= 1 && !this.props.isOnObjectEditor)) {
return null
}

    const steps = this.props.showFloorSteps ? getFloorLevels(this.props.currentFloor, this.props.floors) : [this.props.currentFloor]
    const nextFloor = this.props.floors.getNext(this.props.currentFloor!)
    const previousFloor = this.props.floors.getPrevious(this.props.currentFloor!)

    return (
      <CanvasNavigationButtonGroup>
        <CanvasNavigationButton
          label={i18n('UPPER_FLOOR')}
          icon='expand-less'
          disabled={nextFloor?.name === this.props.currentFloor.name}
          onClick={() => {
            this.props.onClick(nextFloor)
          }}
          tooltipPlacement='left' />
        {reverse(steps).map((floor) => {
          return (
            <CanvasNavigationButton
              hideOnSmallViewport={floor.name !== this.props.currentFloor?.name}
              key={floor.id}
              label={floor.getTooltip()}
              onClick={() => this.props.onClick(floor)}
              tooltipPlacement='left'
              selected={floor.name === this.props.currentFloor?.name}
              testId={`floor-${floor.name}`}>
              {floor.acronym}
            </CanvasNavigationButton>
          )
        })}
        <CanvasNavigationButton
          label={i18n('LOWER_FLOOR')}
          icon='expand-more'
          disabled={previousFloor?.name === this.props.currentFloor.name}
          onClick={() => {
            this.props.onClick(previousFloor)
          }}
          tooltipPlacement='left' />
      </CanvasNavigationButtonGroup>
    )
  }
}
