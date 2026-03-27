import {isNil, isNumber, isUndefined, omitBy} from 'lodash/fp'

import {
  ColorEncoding,
  DeckSizeType,
  Encoding,
  getColorAccessor,
  getSizeAccessor,
  PositionEncoding,
  SizeEncoding,
} from '@hopara/encoding'
import {Columns, Rows, RowTranslator} from '@hopara/dataset'
import {LayerFactory} from '../../LayerFactory'
import {DataComparator} from '../../DataComparator'
import {DeckLayerProps} from '../../DeckLayerFactory'
import {EditCallbackProps} from '../interaction/EditCallbackFactory'
import {ExtensionsManager, ExtensionType} from '../ExtensionsManager'
import {SizeUnits} from '@hopara/encoding/src/size/SizeEncoding'

const HIGHLIGHT_COLOR = [0, 0, 0, 77]

export function getMaxPixels(viewport: any, sizeEncoding?: SizeEncoding, encodingConfig?: any, scale = 1) {
  if (!viewport || !isNumber(sizeEncoding!.getRenderValue()) || !encodingConfig?.maxResizeZoom || encodingConfig.units !== SizeUnits.COMMON) return Number.MAX_SAFE_INTEGER
  const sizePixels = viewport.getSizePixels(sizeEncoding!.getRenderValue()!, encodingConfig.units, encodingConfig?.maxResizeZoom)
  return sizePixels * scale
}

export abstract class BaseFactory<P> implements LayerFactory<P> {
  dataComparator: DataComparator = new DataComparator()

  updateDataComparator(layerProps: DeckLayerProps) {
    this.dataComparator.update(layerProps.id, {
      cacheKey: layerProps.rows?.getEtagValue() + layerProps.edit.isDragging,
      lastModified: layerProps.lastModified,
    })
  }

   
  getDeckProps(layerProps: DeckLayerProps, customProps: Record<any, any>): any {
    this.updateDataComparator(layerProps)
    const validProps = {
      ...customProps,
      layerId: layerProps.layerId,
      visible: layerProps.visible?.value,
      editable: layerProps.edit.editable,
      colorEncoding: layerProps.encoding.getColor(),
      dataComparator: this.dataComparator.isEqual(layerProps.id),
      extensions: ExtensionsManager.add(customProps.extensions, ExtensionType.precision),
    }

    if (!isNil(customProps.stroked)) {
      validProps['stroked'] = !!customProps.stroked
    }

    if (layerProps.highlight) {
      validProps['highlightColor'] = HIGHLIGHT_COLOR
      validProps['autoHighlight'] = true
    }

    return omitBy(isUndefined, validProps)
  }

  static createEncodingTriggers(encoding: Encoding | undefined, rows: Rows | undefined) {
    const triggers:Array<any> = []

    triggers.push(encoding?.getUpdatedTimestamp())
    triggers.push(rows?.getEtagValue())

    return triggers
  }

  getPositionUpdateTrigger(position: PositionEncoding | undefined, isDragging: boolean, rows: Rows | undefined) {
    const triggers = BaseFactory.createEncodingTriggers(position, rows)
    if (isDragging) {
      triggers.push(() => ({}))
    }
    return triggers
  }

  getEncodingUpdateTrigger(encoding: Encoding | undefined, rows: Rows | undefined) {
    return BaseFactory.createEncodingTriggers(encoding, rows)
  }

  getColorAccessor(
    columns?: Columns,
    color?: ColorEncoding,
    rows?: Rows,
    rowTranslator?: RowTranslator) {
    return getColorAccessor(
      color as ColorEncoding,
      rows || new Rows(),
      columns as Columns,
      rowTranslator)
  }

  getSizeAccessor(rows: Rows,
                  encoding?: SizeEncoding,
                  rowTranslator?: RowTranslator,
                  deckSizeType?: DeckSizeType) {
    return getSizeAccessor(rows, encoding, rowTranslator, deckSizeType)
  }

  getEditCallbackProps(layerProps: DeckLayerProps): EditCallbackProps {
    return {
      editable: layerProps.edit.editable,
      rowEdit: layerProps.edit.rowEdit,
      callbacks: layerProps.callbacks,
      layerId: layerProps.layerId,
      parentId: layerProps.parentId,
      rowsetId: layerProps.rowsetId,
    }
  }

  getMaxPixels(viewport: any, sizeEncoding?: SizeEncoding, encodingConfig?: any, scale?: number) {
    return getMaxPixels(viewport, sizeEncoding, encodingConfig, scale)
  }

  abstract create(props): any[];
}
