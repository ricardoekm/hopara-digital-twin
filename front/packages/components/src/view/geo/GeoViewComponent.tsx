import DeckView from '../DeckView'
import {Config} from '@hopara/config'
import WebMarcatorView from '../deck/WebMercatorView'

const isMapEnabled = Config.getValueAsBoolean('ENABLE_MAP')

export class GeoViewComponent extends DeckView {
  constructor(props) {
    super(props)
    this.renderMap = isMapEnabled
  }

  getViews() {
    return [
      new WebMarcatorView({
        id: 'main-view',
        controller: this.getViewController(),
      }),
    ]
  }
}
