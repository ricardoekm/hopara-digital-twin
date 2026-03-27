import {CompositeMode, TranslateMode} from 'nebula.gl'
import {ScaleMode} from './ScaleMode'
import {StaticTranslateMode} from './StaticTranslateMode'
import {FeatureCollection, GuideFeatureCollection, ModeProps, StopDraggingEvent} from '@nebula.gl/edit-modes'

export class TransformMode extends CompositeMode {
  context = {}

  handlePointerMove(event: any, props: ModeProps<FeatureCollection>) {
    let updatedCursor = null as any
    super.handlePointerMove(event, {
      ...props,
      onUpdateCursor: (cursor) => {
        updatedCursor = cursor || updatedCursor
      },
    })
    props.onUpdateCursor(updatedCursor)
  }

  handleStartDragging(event: any, props: ModeProps<FeatureCollection>) {
    this.context = {}
    let scaleMode = null as any
    let translateMode = null as any
    const filteredModes = [] as any[]

    this._modes.forEach((mode) => {
      if (mode instanceof TranslateMode || mode instanceof StaticTranslateMode) {
        translateMode = mode
      } else {
        if (mode instanceof ScaleMode) {
          scaleMode = mode
        }
        filteredModes.push(mode)
      }
    })

    if (scaleMode instanceof ScaleMode && !scaleMode.isEditHandleSelected()) {
      filteredModes.push(translateMode)
    }

    this._modes.forEach((mode) => mode.handleStartDragging(event, {...props, context: this.context} as any))
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void {
    super.handleStopDragging(event, {...props, context: this.context} as any)
    this.context = {}
  }

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    // TODO: Combine the guides *BUT* make sure if none of the results have
    // changed to return the same object so that "guides !== this.state.guides"
    // in editable-geojson-layer works.

    const allGuides: any[] = []
    for (const mode of this._modes) {
      allGuides.push(...mode.getGuides({...props, context: this.context} as any).features)
    }

    return {
      type: 'FeatureCollection',
      features: allGuides,
    }
  }
}
