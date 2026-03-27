import { IdentityScale } from './IdentityScale'
import { Projector } from './Projector'

export class IdentityProjector extends Projector {
  constructor() {
    super({x: IdentityScale, y: IdentityScale})
  }
}
