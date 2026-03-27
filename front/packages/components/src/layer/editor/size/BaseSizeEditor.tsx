import { isNil } from 'lodash'
import { PureComponent } from 'react'
import { SizeEncoding, SizeUnits } from '@hopara/encoding'

export interface BaseStateProps {
  maxSize?: number
  minSize?: number
  units: SizeUnits
  encoding: SizeEncoding
  zoom: number
}

export class BaseSizeEditor<T extends BaseStateProps> extends PureComponent<T> {
  getMinSize() {
    return (this.props.minSize ?? 0)
  }

  getMaxSize() {
    if (!isNil(this.props.maxSize)) {
      return this.props.maxSize as number
    }

    if (this.props.units === SizeUnits.METERS) {
      return 2000
    }

    return 100
  }

  getStepSize() {
    if (this.props.units === SizeUnits.METERS) {
      return 20
    }

    return 1
  }

  getPixelsValue(): number {
    return Math.round(this.props.encoding.getPixelValue(this.props.zoom))
  }
}
