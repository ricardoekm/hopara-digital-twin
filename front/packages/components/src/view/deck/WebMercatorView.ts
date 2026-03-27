import { MapView } from '@deck.gl/core'
import WebMercatorViewport from './WebMercatorViewport'

export default class WebMarcatorView extends MapView {
  constructor(props) {
    super({
      ...props,
      type: WebMercatorViewport,
    })
  }

  // eslint-disable-next-line no-restricted-syntax
  get ViewportType() {
    return WebMercatorViewport
  }
}
