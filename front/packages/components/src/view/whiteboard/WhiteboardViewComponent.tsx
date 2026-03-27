import { Dimensions } from '@hopara/spatial'
import DeckView from '../DeckView'
import OrthographicView from '../deck/OrthographicView'
import { OrthographicViewport } from '../deck/OrthographicViewport'

export const REFERENCE_SCREEN_WIDTH = 1920

export class WhiteboardViewComponent extends DeckView {
  getScaleFactor(dimensions?: Dimensions): number {
    // we use 1920 as the default width for the whiteboard world
    return dimensions?.width ? REFERENCE_SCREEN_WIDTH / dimensions.width : 1
  }

  getViews() {
    if (!this.props.world || !this.props.viewState) return []
    const viewPortProps = this.props.viewState.getOrtographicViewPortProps(this.props.world)
    const worldDimensions = this.props.viewState.getDimensions()

    return [
      new OrthographicView({
        ...viewPortProps,
        id: 'main-view',
        controller: this.getViewController(),
        translationMatrix: undefined,
        scaleFactor: this.getScaleFactor(worldDimensions),
      }),
    ]
  }

  getUpdatedViewport(viewport: OrthographicViewport, dimensions: Dimensions): OrthographicViewport {
    return new viewport.ViewportType({
      ...viewport,
      ...dimensions,
      scaleFactor: this.getScaleFactor(dimensions),
    } as any) as OrthographicViewport
  }
}
