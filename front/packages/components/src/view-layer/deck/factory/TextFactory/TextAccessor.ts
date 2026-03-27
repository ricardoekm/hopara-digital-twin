import { Row } from '@hopara/dataset'
import { testCondition, TextEncoding } from '@hopara/encoding'
import FontAtlasManager from '@deck.gl/layers/dist/es5/text-layer/font-atlas-manager'
import { transformParagraph } from '@deck.gl/layers/dist/es5/text-layer/utils'
import { ELLIPSIS, limitText } from './LimitText'
import { Bounds, Dimensions } from '@hopara/spatial'
import ViewState from '../../../../view-state/ViewState'
import { OrthographicViewport } from '../../../../view/deck/OrthographicViewport'
import WebMercatorViewport from '../../../../view/deck/WebMercatorViewport'
import OrbitViewport from '../../../../view/deck/OrbitViewport'
import { MaxLengthType } from '@hopara/encoding/src/text/TextEncoding'
import { SizeUnits } from '@hopara/encoding/src/size/SizeEncoding'

const getSizeCommons = (row: Row, sizeAccessor: any, sizeUnits: SizeUnits, viewState: ViewState) => {
  const size = typeof sizeAccessor === 'function' ? sizeAccessor(row) : sizeAccessor
  return sizeUnits === SizeUnits.PIXELS ? viewState.projectPixelToCommons(size) : size
}

function createBoundsSizeFunction(viewport: OrbitViewport | WebMercatorViewport | OrthographicViewport, 
                                  sizeAccessor: any, sizeUnits: SizeUnits, viewState: ViewState, fontAtlasManager: FontAtlasManager) {
  return (row: Row): Dimensions => {
    const geometry = row.getCoordinates().getGeometryLike()
    const projected = geometry.map((coord) => viewport!.project(coord))
    const bounds = Bounds.fromGeometry(projected, { orthographic: true, flipY: true })
    const textSizeCommons = getSizeCommons(row, sizeAccessor, sizeUnits, viewState)
    const commonsWidth = viewState.projectPixelToCommons(bounds.getWidth()) / textSizeCommons
    const commonsHeight = viewState.projectPixelToCommons(bounds.getHeight()) / textSizeCommons
    const multiplier = fontAtlasManager.props.fontSize
    const padding = fontAtlasManager.props.fontSize * 0.5
    return { width: (commonsWidth * multiplier) - padding, height: (commonsHeight * multiplier) - padding }
  }
}

const LINE_HEIGHT = 1

function getText(encoding:TextEncoding, row:Row, fontAtlasManager: FontAtlasManager, getBoundsSizeFunction: any) {
  if (encoding.hasCondition()) {
    for (const condition of encoding.conditions!) {
      if (testCondition(condition, row)) {
        return getText(new TextEncoding(condition), row, fontAtlasManager, getBoundsSizeFunction)
      }
    }
  }

  const text = encoding.getValue(row)
  if (encoding.maxLength?.type !== MaxLengthType.AUTO) return text

  const boundsSize = getBoundsSizeFunction(row)
  const transformedText = transformParagraph(text, LINE_HEIGHT, 'break-word', boundsSize.width, fontAtlasManager.mapping)
  return limitText(text, transformedText, boundsSize, fontAtlasManager.mapping[ELLIPSIS].layoutWidth)
}

export function getTextAccessor(encoding: TextEncoding, sizeAccessor: any, sizeUnits: SizeUnits,
                                fontAtlasManager: FontAtlasManager, 
                                viewport: OrthographicViewport | WebMercatorViewport | OrbitViewport,
                                viewState: ViewState) {
  const getBoundsSizeFunction = createBoundsSizeFunction(viewport, sizeAccessor, sizeUnits, viewState, fontAtlasManager)
  return (row:Row) => {
    return getText(encoding, row, fontAtlasManager, getBoundsSizeFunction)
  }
}


