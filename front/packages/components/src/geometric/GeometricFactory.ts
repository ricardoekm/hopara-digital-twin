import {OrthographicViewport} from '../view/deck/OrthographicViewport'
import WebMercatorViewport from '../view/deck/WebMercatorViewport'
import OrbitViewport from '../view/deck/OrbitViewport'
import { OrthographicGeometric, WebMercatorGeometric } from '@hopara/spatial'

export function isOrthographic(viewport?: OrthographicViewport | WebMercatorViewport | OrbitViewport) {
  return viewport instanceof OrthographicViewport
}

export function geometricFromViewport(viewport?: OrthographicViewport | WebMercatorViewport | OrbitViewport) {
  if (isOrthographic(viewport)) {
    return new OrthographicGeometric()
  }
  return new WebMercatorGeometric()
}

