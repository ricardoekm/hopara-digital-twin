import {EditorGroup, LayerEditorFactory, LayerEditorType} from '../LayerEditorFactory'
import {AnimationEditorContainer} from './AnimationEditorContainer'

export class AnimationEditorFactory extends LayerEditorFactory {
  public readonly key = LayerEditorType.animation
  public readonly group = EditorGroup.animation
  create = AnimationEditorContainer
}
