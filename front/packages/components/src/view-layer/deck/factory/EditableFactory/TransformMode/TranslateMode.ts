import {TranslateMode as NebulaTranslateMode} from 'nebula.gl'
import {ModeProps} from '@nebula.gl/edit-modes/src/types'
import {FeatureCollection} from '@nebula.gl/edit-modes/src/geojson-types'
import { DraggingEvent, GuideFeatureCollection, StartDraggingEvent, StopDraggingEvent} from '@nebula.gl/edit-modes'
import { featureCollection } from '@turf/helpers'
import lineToPolygon from '@turf/line-to-polygon'
import { geometricFromViewport } from '../../../../../geometric/GeometricFactory'

export class TranslateMode extends NebulaTranslateMode {
  _isTranslating
  _geometryBeforeTranslate

  getGuides(props: ModeProps<FeatureCollection>) {
    const selectedGeometry = this.getSelectedFeaturesAsFeatureCollection(props)
    const geo = geometricFromViewport(props.modeConfig.viewport)
    const rotatedBBox = geo.getRotatedBBox(selectedGeometry as any)
    rotatedBBox.properties = {
      guideType: 'editHandle',
      editHandleType: 'translate',
    }
    if ((props as any).context.hideGuides && !props.modeConfig.fixedGuides) return {type: 'FeatureCollection', features: []} as any
    return featureCollection([lineToPolygon(rotatedBBox) as any]) as GuideFeatureCollection
  }

  // prevent default modify mode add and remove positions
  handleClick() {
    return
  }

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>) {
    if (!this._isTranslating) return

    event.cancelPan()

    if (this._geometryBeforeTranslate) {
      // Translate the geometry
      const editAction = (this as any).getTranslateAction(
        event.pointerDownMapCoords,
        event.mapCoords,
        'translating',
        props,
      )

      if (editAction) {
        props.onEdit(editAction)
      }
    }
  }

  notContainsGuide(picks: any[]): boolean {
    return !picks.some((elm) => elm.isGuide)
  }

  getPickedHandle(picks: any[]) {
    const guidePicks = picks?.filter((pick) => pick.isGuide && pick.object.properties.guideType === 'editHandle')
    if (guidePicks.length && guidePicks?.every((pick) => pick.object.properties.editHandleType === 'translate')) {
      return [guidePicks[0]]
    }
    return []
  }

  getNonGuideFeatures(picks: any[]) {
    return picks && picks.filter((pick) => !pick.isGuide)
  }

  isTranslatable(picks:Pick<any, any>[]) {
    return !!this.getPickedHandle(picks).length
  }

  handlePointerMove(event: any, props: ModeProps<FeatureCollection>) {
    this._isTranslatable = this.isTranslatable(event.picks)
    this.updateCursor(props)
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    // to avoid issues with parent class
    this._isTranslatable = this.isTranslatable(event.picks)
    if (!this._isTranslatable) return

    this._isTranslating = true
    event.cancelPan()
    this._geometryBeforeTranslate = this.getSelectedFeaturesAsFeatureCollection(props);
    (props as any).context.hideGuides = true
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    if (this._geometryBeforeTranslate) {
      // Translate the geometry
      const editAction = (this as any).getTranslateAction(
        event.pointerDownMapCoords,
        event.mapCoords,
        'translated',
        props,
      )

      if (editAction) {
        props.onEdit(editAction)
      }

      this._geometryBeforeTranslate = null
      this._isTranslating = false
    }
  }
}
