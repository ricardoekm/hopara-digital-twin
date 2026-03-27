import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {PositionEditorContainer} from './PositionEditorContainer'

export class PositionEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingPosition
  public readonly group = EditorGroup.position
  create = PositionEditorContainer

  getAliases(): string[] {
    return super.getAliases(['PositionEncoding'])
  }
}
