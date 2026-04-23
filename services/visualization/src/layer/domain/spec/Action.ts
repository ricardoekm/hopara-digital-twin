import { ZoomValue } from './ZoomRange.js'
import { Visible } from './Visible.js'
import { randomUUID } from 'node:crypto'

export type TemplateString = string

export type VisualizationJumpFilter = {
  field?: string
  value?: any
  targetField?: string
}

export enum ActionType {
  VISUALIZATION_JUMP = 'VISUALIZATION_JUMP',
  EXTERNAL_LINK_JUMP = 'EXTERNAL_LINK_JUMP',
  ZOOM_JUMP = 'ZOOM_JUMP',
  FUNCTION_CALLBACK = 'FUNCTION_CALLBACK'
}

export enum Trigger {
  NONE = 'NONE',
  OBJECT_CLICK = 'OBJECT_CLICK',
  OBJECT_HOVER = 'OBJECT_HOVER',
  OBJECT_LEFT = 'OBJECT_LEFT'
}

export class ActionBase {
  id?: string
  title: string
  visible?: Visible
  type: ActionType
  autoTrigger?: boolean
  showDetails?: boolean
  trigger?: Trigger

  constructor(props?: Partial<ActionBase>) {
    Object.assign(this, props ?? {})
    if (!this.id) {
      this.id = randomUUID()
    }
  }
}

export class VisualizationJump extends ActionBase {
  declare type: ActionType.VISUALIZATION_JUMP
  visualization?: string
  filters: VisualizationJumpFilter[]
}

export class ExternalLinkJump extends ActionBase {
  declare type: ActionType.EXTERNAL_LINK_JUMP
  href: TemplateString
  target?: string
}

export interface Navigate {
  zoom?: ZoomValue
  bearing?: false | {
    field?: string
    value?: number
  }
}

export class ZoomJump implements ActionBase, Navigate {
  id?: string
  title: string
  visible?: Visible
  zoom?: ZoomValue
  bearing?: false | {
    field?: string
    value?: number
  }
  type: ActionType.ZOOM_JUMP
}

export class FunctionCallback extends ActionBase {
  declare type: ActionType.FUNCTION_CALLBACK
  name: string
}


export type ActionSpec = (VisualizationJump | ExternalLinkJump | ZoomJump | FunctionCallback)

export type Actions = ActionSpec[]
