import * as Case from 'case'
import {Layer} from '../Layer'
import {JsonPropertyMeta, JsonSchema} from './JsonSchema'
import {NameEditorFactory} from './name/NameEditorFactory'
import {TypeEditorFactory} from './type/TypeEditorFactory'
import {DataEditorFactory} from './data/DataEditorFactory'
import {TransformEditorFactory} from './transform/TransformEditorFactory'
import {PositionEditorFactory} from './position/PositionEditorFactory'
import {OffsetEditorFactory} from './offset/OffsetEditorFactory'
import {ChildrenEditorFactory} from './children/ChildrenEditorFactory'
import {ArcEditorFactory} from './arc/ArcEditorFactory'
import {ImageEditorFactory} from './image/ImageEditorFactory'
import {IconEditorFactory} from './icon/IconEditorFactory'
import {ModelEditorFactory} from './model/ModelEditorFactory'
import {TextEditorFactory} from './text/TextEditorFactory'
import {SizeEditorFactory} from './size/SizeEditorFactory'
import {SizeMultiplierEditorFactory} from './size/SizeMultiplierEditorFactory'
import {ColorEditorFactory} from './color/ColorEditorFactory'
import {AnimationEditorFactory} from './animation/AnimationEditorFactory'
import {VisibilityEditorFactory} from './visibility-editor/VisibilityEditorFactory'
import {DetailsEditorFactory} from './details/DetailsEditorFactory'
import {ActionsEditorFactory} from './actions/ActionsEditorFactory'
import {LayerEditorFactory} from './LayerEditorFactory'
import {BorderColorEditorFactory} from './border/BorderColorEditorFactory'
import {BorderSizeEditorFactory} from './border/BorderSizeEditorFactory'
import {ShadowEditorFactory} from './shadow/ShadowEditorFactory'
import {LineEditorFactory} from './line/LineEditorFactory'
import Visualization from '../../visualization/Visualization'
import {MapEditorFactory} from './map/MapEditorFactory'
import {TemplateEditorFactory} from './template/TemplateEditorFactory'
import {TextFormatEditorFactory} from './text/TextFormatEditorFactory'
import {BorderRadiusEditorFactory} from './border/BorderRadiusEditorFactory'

function getEditorTypesFromLayer(visualization: Visualization, layer: Layer, jsonSchema: JsonSchema): JsonPropertyMeta[] {
  const definitionName = `${layer.hasParent() ? 'Composable' : ''}${Case.pascal(layer.type)}Layer`
  const layerSchema = jsonSchema.getSubSchema(definitionName)
  let editorTypes = layerSchema.getPropertiesMeta()

  editorTypes = editorTypes.concat(
    layerSchema
      .getPropertySchema('encoding')
      .getPropertiesMeta('encoding.'),
  )
  editorTypes = editorTypes.concat(
    layerSchema
      .getPropertySchema('data')
      .getPropertiesMeta('data.'),
  )
  if (layer.canAnimate(visualization.type)) {
    editorTypes.push({name: 'animation'})
  }
  return editorTypes
}

class LayerEditorFactories extends Array<LayerEditorFactory> {
  getEditorFactories(editorTypes: JsonPropertyMeta[]): LayerEditorFactory[] {
    return editorTypes
      .map((type) => {
        let factories = this.filterByAlias(type.definitionName)
        if (!factories.length) factories = this.filterByAlias(type.name)
        return factories
      })
      .flat()
      .filter((editor) => !!editor) as LayerEditorFactory[]
  }

  getFromLayer(visualization: Visualization, layer: Layer, schema: any): LayerEditorFactories {
    const editorTypes = getEditorTypesFromLayer(visualization, layer, new JsonSchema(schema))
    const selectedEditorFactories = this.getEditorFactories(editorTypes)
    return new LayerEditorFactories(...this.filter((editor) => selectedEditorFactories.includes(editor)))
  }

  private filterByAlias(editorAlias?: string): LayerEditorFactory[] {
    if (!editorAlias) return []
    return this.filter((editorFactory) => editorFactory.getAliases().includes(editorAlias))
  }
}

export const layerEditorFactories = new LayerEditorFactories(...[
  new TypeEditorFactory(),
  new NameEditorFactory(),
  new DataEditorFactory(),
  new TransformEditorFactory(),
  new PositionEditorFactory(),
  new TemplateEditorFactory(),
  new OffsetEditorFactory(),
  new ChildrenEditorFactory(),
  new ArcEditorFactory(),
  new ImageEditorFactory(),
  new IconEditorFactory(),
  new ModelEditorFactory(),
  new TextEditorFactory(),
  new SizeEditorFactory(),
  new SizeMultiplierEditorFactory(),
  new LineEditorFactory(),
  new MapEditorFactory(),
  new ColorEditorFactory(),
  new BorderSizeEditorFactory(),
  new BorderColorEditorFactory(),
  new BorderRadiusEditorFactory(),
  new TextFormatEditorFactory(),
  new AnimationEditorFactory(),
  new VisibilityEditorFactory(),
  new DetailsEditorFactory(),
  new ActionsEditorFactory(),
  new ShadowEditorFactory(),
])
