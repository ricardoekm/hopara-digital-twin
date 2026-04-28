import {Visible} from '../layer/Visible'
import {ZoomValue} from '../zoom/ZoomValue'
import {i18n} from '@hopara/i18n'

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
  FUNCTION_CALLBACK = 'FUNCTION_CALLBACK',
}

export enum Trigger {
  NONE = 'NONE',
  OBJECT_CLICK = 'OBJECT_CLICK',
  OBJECT_HOVER = 'OBJECT_HOVER',
  OBJECT_LEFT = 'OBJECT_LEFT'
}

class BaseAction {
  id?: string
  title: string
  visible?: Visible
  type: ActionType
  icon?: string
  showDetails?: boolean
  trigger?:Trigger

  constructor(props?: Partial<BaseAction>) {
    Object.assign(this, props ?? {})
    this.id = props?.id ?? crypto.randomUUID()
    this.title = props?.title ?? i18n('NEW_ACTION')
  }
}

export class VisualizationJump extends BaseAction {
  type: ActionType.VISUALIZATION_JUMP
  app?: string
  visualization?: string
  filters: VisualizationJumpFilter[]

  constructor(props?: Partial<VisualizationJump>) {
    super(props)
    Object.assign(this, props ?? {})
    this.type = ActionType.VISUALIZATION_JUMP
    if (!this.filters) {
      this.filters = []
    }
  }
}

export class ExternalLinkJump extends BaseAction {
  type: ActionType.EXTERNAL_LINK_JUMP
  href: TemplateString
  target?: string

  constructor(props?: Partial<ExternalLinkJump>) {
    super(props)
    Object.assign(this, props ?? {})
    this.type = ActionType.EXTERNAL_LINK_JUMP
    this.target = props?.target ?? '_blank'
  }
}

export interface Navigate {
  bearing?: false | {
    field?: string
    value?: number
    padding?: number
  };
  zoom?: ZoomValue;
}

export class ZoomJump extends BaseAction {
  type: ActionType.ZOOM_JUMP
  bearing: {
    field?: string
    value?: number
  }
  zoom: ZoomValue

  constructor(props?: Partial<ZoomJump>) {
    super(props)
    Object.assign(this, props ?? {})
    this.type = ActionType.ZOOM_JUMP
  }
}

export class FunctionCallback extends BaseAction {
  type: ActionType.FUNCTION_CALLBACK
  name: string

  constructor(props?: Partial<FunctionCallback>) {
    super(props)
    Object.assign(this, props ?? {})
    this.type = ActionType.FUNCTION_CALLBACK
  }
}


export type Action = (VisualizationJump | ExternalLinkJump | ZoomJump | FunctionCallback)
