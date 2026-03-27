import {sceneVisit as VegaSceneVisit} from 'vega'
import { MarkStager, MarkStagerOptions } from './interfaces'
import { Scene, SceneLine } from 'vega-typings'
import { Stage } from '../stagers/SceneToStage'
import { getEnrichedData } from '../RowEnricher'
import { getFillColor } from './colors'

const markStager: MarkStager = (options: MarkStagerOptions, stage: Stage, scene: Scene) => {
  VegaSceneVisit(scene, function(item: SceneLine | any) {
    stage.arcs?.push({
      bounds: item.bounds,
      position: [item.x, item.y, 0],
      startAngle: item.startAngle,
      endAngle: item.endAngle,
      innerRadius: item.innerRadius,
      outerRadius: item.outerRadius,
      color: getFillColor(item),
      ...getEnrichedData(item.datum),
    })
  })
}


export default markStager
