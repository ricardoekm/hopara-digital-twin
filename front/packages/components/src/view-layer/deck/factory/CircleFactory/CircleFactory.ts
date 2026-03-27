import {DeckLayer} from '../../DeckLayer'
import {StrokableFactory} from '../StrokableFactory'
import { decorateOffset } from '../../offset/OffsetDecorator'
import { DeckLayerProps } from '../../../DeckLayerFactory'
import { DeckSizeType, PositionAccessorFactory } from '@hopara/encoding'
import { CallbacksFactory } from '../../interaction/CallbacksFactory'
import {CircleLayer} from './CircleLayer'
import { IndexRowTranslator } from '@hopara/dataset'
import { decorateAnimation } from '../../animation/AnimationDecorator'

const DIAMETER_TO_RADIUS = 0.5

export class CircleFactory extends StrokableFactory {
  create(props: DeckLayerProps): DeckLayer[] {
    const multiplier = props.encoding.size?.multiplier ?? 1
    let deckProps = super.getDeckProps(props, {
      id: props.id,
      data: props.rows,
      getFillColor: super.getColorAccessor(
        props.columns,
        props.encoding.color,
        props.rows),
      getPosition: PositionAccessorFactory.create(props.encoding.position?.anchor),
      getRadius: super.getSizeAccessor(
        props.rows,
        props.encoding.size,
        undefined,
        DeckSizeType.RADIUS,
      ),
      radiusMaxPixels: super.getMaxPixels(props.viewport, props.encoding.size, props.encoding.config, multiplier * DIAMETER_TO_RADIUS),
      updateTriggers: {
        getFillColor: super.getEncodingUpdateTrigger(props.encoding.color, props.rows),
        getRadius: super.getEncodingUpdateTrigger(props.encoding.size, props.rows),
        getPosition: super.getPositionUpdateTrigger(props.encoding.position, props.edit.isDragging, props.rows),
      },
      radiusUnits: props.encoding.getUnits(),
      ...super.getStrokeProps(props),
      pickable: props.edit.pickable,
      billboard: true,
      innerShadow: props.encoding.shadow?.inner,
      outerShadow: props.encoding.shadow?.outer,
      ...CallbacksFactory.create(this.getEditCallbackProps(props), new IndexRowTranslator(props.rows)),
    })

    deckProps = decorateOffset(props, deckProps)
    deckProps = decorateAnimation(props, deckProps)

    return [new CircleLayer(deckProps)]
  }
}
