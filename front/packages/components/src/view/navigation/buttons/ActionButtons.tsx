import React from 'react'
import {CanvasNavigationButton} from '@hopara/design-system/src/navigation/CanvasNavigationButton'
import {CanvasNavigationButtonGroup} from '@hopara/design-system/src/navigation/CanvasNavigationButtonGroup'
import {createActionButtons} from '../../../action/ActionLineFactory'
import { PureComponent } from '@hopara/design-system'
import { Action } from '../../../action/Action'
import { Actions } from '../../../action/Actions'
import { CallbackFunction } from '../../../action/ActionReducer'

export interface StateProps {
  actions: Actions
  tenant: string
  registeredCallbacks: CallbackFunction[]
}

export interface ActionProps {
  onActionClick: (action: Action) => void
}

export class ActionButtons extends PureComponent <StateProps & ActionProps> {
  render() {
    if (!this.props.actions.length) return null

    const buttons = createActionButtons(
      undefined,
      this.props.actions ?? [],
      this.props.registeredCallbacks,
      this.props.onActionClick,
    )

    return <CanvasNavigationButtonGroup>
      {buttons.map((action, index) => (
        <CanvasNavigationButton
          key={index}
          label={action.title}
          resourceIcon={action.icon}
          onClick={action.onClick}
          tooltipPlacement='left'
          tenant={this.props.tenant}
          disabled={action.enabled === false}
        />
      ))}
    </CanvasNavigationButtonGroup>
  }
}
