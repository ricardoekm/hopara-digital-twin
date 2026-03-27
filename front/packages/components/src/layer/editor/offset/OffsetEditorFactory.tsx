import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {OffsetEditorContainer} from './OffsetEditorContainer'
import {Layer} from '../../Layer'

export class OffsetEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.encodingOffset
  public readonly group = EditorGroup.position
  create = OffsetEditorContainer

  getGroup(layer: Layer): string {
    return layer.hasParent() ? EditorGroup.positionOffset : EditorGroup.position
  }

  getAliases(): string[] {
    return super.getAliases(['OffsetEncoding'])
  }
}
