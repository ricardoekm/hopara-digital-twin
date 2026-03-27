import {ControllerOptions} from '@deck.gl/core/controllers/controller'
import { VisualizationType } from '../visualization/Visualization'

export enum DragMode {
  PAN = 'pan',
  ROTATE = 'rotate'
}

const DEFAULT_DRAG_MODE = DragMode.PAN

export enum ActiveEvent {
  NONE = 'none',
  PAN = 'pan',
}

export class ViewController implements ControllerOptions {
  visualizationType: VisualizationType
  dragMode: DragMode
  dragPan: boolean
  dragRotate: boolean
  activeEvent: ActiveEvent

  constructor(props: Partial<ViewController>) {
    Object.assign(this, props)
    if (this.visualizationType === VisualizationType.THREE_D) this.dragMode = DragMode.ROTATE
    if (!this.dragMode) this.dragMode = DEFAULT_DRAG_MODE
    if (props.dragPan !== false) this.dragPan = true
    if (props.dragRotate !== false) this.dragRotate = true
    if (!this.activeEvent) this.activeEvent = ActiveEvent.NONE
  }

  clone(): ViewController {
    return new ViewController(this)
  }

  reset(): ViewController {
    return new ViewController({
      visualizationType: this.visualizationType,
      dragMode: DEFAULT_DRAG_MODE,
      dragPan: true,
      dragRotate: true,
    })
  }

  immutableToggleDragMode(): ViewController {
    const cloned = this.clone()

    if (this.dragMode === DragMode.PAN) {
      cloned.dragMode = DragMode.ROTATE
    } else {
      cloned.dragMode = DragMode.PAN
    }

    return cloned
  }

  isRotateMode(): boolean {
    return this.dragMode === DragMode.ROTATE
  }

  setActiveEvent(event: ActiveEvent): ViewController {
    const cloned = this.clone()
    cloned.activeEvent = event
    return cloned
  }

  hasActiveEvent(): boolean {
    return this.activeEvent !== ActiveEvent.NONE
  }
}
