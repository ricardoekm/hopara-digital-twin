import { Row, RowTranslator } from '@hopara/dataset'
import { DetailsInteractionInfo, InteractionCallbacks, InteractionSource } from './Interaction'
import { Coordinates } from '@hopara/spatial'
import { LayerInputHandler } from 'deck.gl'

export type DetailsCallbacks = {
  onHover?: LayerInputHandler;
  onClick?: LayerInputHandler;
}

export class DetailsCallbackFactory {
  private static getInfoRow(info: any, rowTranslator?: RowTranslator): Row {
    if (rowTranslator) {
      return rowTranslator.translate(info.object, info.index)
    }

    return new Row(info.object)
  }

  static getDetailsInteractionInfo(info: any, source: InteractionSource, rowTranslator?: any): DetailsInteractionInfo | undefined {
    const row = this.getInfoRow(info, rowTranslator)
    if ((!row && !info.isGuide)) return
    
    if (rowTranslator?.getSource) {
      source = rowTranslator.getSource(info.object)
    }

    return {
      row,
      rowsetId: source.rowsetId as string,
      layerId: source.layerId,
      parentId: source.parentId,
      pixel: Coordinates.fromArray(info.pixel),
    }
  }

  static createCallbacks(callbacks: InteractionCallbacks, source:InteractionSource, rowTranslator?: RowTranslator): DetailsCallbacks {
    return {
      onHover: (info) => {
        return callbacks.onHover && callbacks.onHover(
          this.getDetailsInteractionInfo(info, source, rowTranslator),
        )
      },
      onClick: (info) => {
        return callbacks.onClick && callbacks.onClick(
          this.getDetailsInteractionInfo(info, source, rowTranslator),
        )
      },
    }
  }  
}
