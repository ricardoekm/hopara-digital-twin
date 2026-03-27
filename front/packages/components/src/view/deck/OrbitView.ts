import { OrbitView as DeckOrbitView } from '@deck.gl/core'
import OrbitViewport from './OrbitViewport'

export default class OrbitView extends DeckOrbitView {
  constructor(props) {
    super({
      ...props,
      type: OrbitViewport,
    })
  }

  // eslint-disable-next-line no-restricted-syntax
  get ViewportType() {
    return OrbitViewport
  }
}
