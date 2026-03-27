import { OrthographicView as DeckOrthographicView } from '@deck.gl/core'
import { OrthographicViewport } from './OrthographicViewport'

export default class OrthographicView extends DeckOrthographicView {
  constructor(props) {
    super({
      ...props,
      type: OrthographicViewport,
    })
  }

  // eslint-disable-next-line no-restricted-syntax
  get ViewportType() {
    return OrthographicViewport
  }
}
