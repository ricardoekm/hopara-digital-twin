import { isEmpty } from 'lodash/fp'
import { Action, ActionType, Trigger } from './Action'

export class Actions extends Array<Action> {
  constructor(...actions: Action[]) {
    const a = actions.filter((action) => !!action)
    super(...a)
  }

  clone(): Actions {
    return new Actions(...this)
  }

  private getTriggerActions(trigger:Trigger) : Actions {
    // We can only trigger one not callback action (e.g. zoom jump)
    const callbacks = this.filter((action) => action.trigger === trigger && action.type === ActionType.FUNCTION_CALLBACK)
    const others = this.filter((action) => action.trigger === trigger && action.type !== ActionType.FUNCTION_CALLBACK)
    return new Actions(...callbacks, others[0])
  }

  getObjectClickActions() : Actions {
    return this.getTriggerActions(Trigger.OBJECT_CLICK)
  }

  hasObjectClickActions() {
    return !isEmpty(this.getObjectClickActions())
  }

  getObjectHoverActions() : Actions {
    return this.getTriggerActions(Trigger.OBJECT_HOVER)
  }

  getObjectLeftActions() : Actions {
    return this.getTriggerActions(Trigger.OBJECT_LEFT)
  }

  hasObjectHoverActions() {
    return !isEmpty(this.getObjectHoverActions())
  }

  immutableUpsert(action: Action) {
    const cloned = this.clone()
    const index = cloned.findIndex((a) => a.id === action.id)
    if (index !== -1) {
      cloned[index] = action
    } else {
      cloned.push(action)
    }
    return cloned
  }

  immutableRemove(actionId: string) {
    const cloned = this.clone()
    const index = cloned.findIndex((a) => a.id === actionId)
    if (index !== -1) {
      cloned.splice(index, 1)
    }
    return cloned
  }

  immutableMove(sourceIndex: number, destinationIndex: number) {
    const cloned = this.clone()
    const [removed] = cloned.splice(sourceIndex, 1)
    cloned.splice(destinationIndex, 0, removed)
    return cloned
  }
}
