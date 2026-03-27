import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import { MapEditorContainer } from './MapEditorContainer' 

export class MapEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingMap
  public readonly group = EditorGroup.appearance
  create = MapEditorContainer

  getAliases(): string[] {
    return super.getAliases(['MapEncoding'])
  }
}
