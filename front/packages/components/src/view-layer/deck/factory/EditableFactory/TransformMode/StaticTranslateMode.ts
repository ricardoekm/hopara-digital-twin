import {TranslateMode} from 'nebula.gl'
import {ModeProps} from '@nebula.gl/edit-modes/src/types'
import {FeatureCollection} from '@nebula.gl/edit-modes/src/geojson-types'

export class StaticTranslateMode extends TranslateMode {
  handlePointerMove(event: any, props: ModeProps<FeatureCollection>) {
    this._isTranslatable = false
    this.updateCursor(props)
  }
}
