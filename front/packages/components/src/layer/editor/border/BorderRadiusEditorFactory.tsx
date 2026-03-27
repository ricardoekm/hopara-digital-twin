import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {BorderRadiusEditorContainer} from './BorderRadiusEditorContainer'

export class BorderRadiusEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingPolygon
  public readonly group = EditorGroup.appearance
  create = BorderRadiusEditorContainer
}
