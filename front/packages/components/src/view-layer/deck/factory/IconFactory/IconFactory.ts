import { DeckLayer } from '../../DeckLayer'
import { BaseFactory } from '../BaseFactory'
import { getSizeAccessor, IconAccessor, PositionAccessorFactory } from '@hopara/encoding'
import { decorateOffset } from '../../offset/OffsetDecorator'
import { IconFetch } from '@hopara/resource'
import { DeckLayerProps } from '../../../DeckLayerFactory'
import { CallbacksFactory } from '../../interaction/CallbacksFactory'
import { IndexRowTranslator } from '@hopara/dataset'
import { decorateAnimation } from '../../animation/AnimationDecorator'
import IconLayer from './IconLayer'

export class IconFactory extends BaseFactory<DeckLayerProps> {
  getLoadOptions(props: DeckLayerProps) {
    const iconFetch = new IconFetch()
    return { fetch: iconFetch.fetch(props.resource.onResourceDownloadProgressChange, undefined, props.resource.authorization) }
  }

  create(props: DeckLayerProps): DeckLayer[] {
    const multiplier = props.encoding.size?.multiplier ?? 1
    let deckProps = super.getDeckProps(props, {
      id: props.id,
      data: props.rows,
      loadOptions: this.getLoadOptions(props),
      pickable: props.edit.pickable,
      sizeUnits: props.encoding?.getUnits(),
      getSize: getSizeAccessor(
        props.rows,
        props.encoding.size
      ),
      getColor: super.getColorAccessor(props.columns, props.encoding.color, props.rows),
      getPosition: PositionAccessorFactory.create(props.encoding.position?.anchor),
      getIcon: (row: any) => {
        return IconAccessor.getIcon(props.encoding.icon, row)
      },
      getIconFrames: (row: any) => IconAccessor.getIcon(props.encoding.icon, row),
      sizeMaxPixels: super.getMaxPixels(props.viewport, props.encoding.size, props.encoding.config, multiplier),
      updateTriggers: {
        getColor: super.getEncodingUpdateTrigger(props.encoding.color, props.rows),
        getSize: super.getEncodingUpdateTrigger(props.encoding.size, props.rows),
        getPosition: super.getPositionUpdateTrigger(props.encoding.position, props.edit.isDragging, props.rows),
        getIcon: super.getEncodingUpdateTrigger(props.encoding.icon, props.rows),
        getIconFrames: super.getEncodingUpdateTrigger(props.encoding.icon, props.rows),
        getLineSize: super.getEncodingUpdateTrigger(props.encoding.strokeSize, props.rows),
        getLineColor: super.getEncodingUpdateTrigger(props.encoding.strokeColor, props.rows)
      },
      getLineColor: props.encoding.strokeColor ? super.getColorAccessor(props.columns, props.encoding.strokeColor) : '#fff',
      getLineWidth: props.encoding.strokeSize ? getSizeAccessor(props.rows, props.encoding.strokeSize) : 0,
      lineOpacity: props.encoding.strokeColor?.opacity ?? 1,
      alphaCutoff: 0,
      iconManager: props.iconManager,
      ...CallbacksFactory.create(this.getEditCallbackProps(props), new IndexRowTranslator(props.rows))
    })

    deckProps = decorateOffset(props, deckProps)
    deckProps = decorateAnimation(props, deckProps)
    return [
      new IconLayer(deckProps)
    ]
  }
}


