import {Encoding, EncodingName} from '../../encoding/domain/Encoding.js'
import {PositionEncodingImpl} from '../../encoding/domain/impl/PositionEncodingImpl.js'
import {LayerType} from './spec/LayerType.js'
import {colorEncodingFactory, sizeEncodingFactory} from '../../encoding/domain/DefaultEncodings.js'
import {Data} from '../../data/domain/spec/Data.js'
import {QueryKey} from '../../data/QueryKey.js'
import isNil from 'lodash/fp/isNil.js'
import {VisibleImpl} from './VisibleImpl.js'
import {Details} from './spec/Details.js'
import {ActionBase, Actions, ActionSpec} from './spec/Action.js'
import {QueryKeys} from '../../data/QueryKeys.js'
import {IconEncodingImpl} from '../../encoding/domain/impl/IconEncodingImpl.js'

export default abstract class LayerImpl {
  id: string
  name?: string
  type: LayerType
  data: Data
  details?: Details
  actions?: Actions
  encoding: Encoding | any = {}
  visible?: VisibleImpl
  highlight?: boolean
  tooltip?: boolean
  children?: LayerImpl[]
  locked?: boolean


  constructor(props?: any) {
    Object.assign(this, props)
    this.visible = new VisibleImpl(props.visible)

    if (!props.encoding) {
      props.encoding = {}
    }

    if (!props.data) {
      this.data = {}
    }

    this.details = {...props.details}

    this.actions = (props.actions ?? []).map((action) => new ActionBase(action) as ActionSpec)

    if (isNil(this.details!.tooltip)) {
      this.details!.tooltip = true
    }

    if (!props.actions) {
      this.actions = []
    }

    if ('size' in this.encoding) {
      this.encoding.size = sizeEncodingFactory.create(this.encoding.size as any, this)
    }
    if ('strokeSize' in this.encoding) {
      this.encoding.strokeSize = sizeEncodingFactory.create(this.encoding.strokeSize as any, this, false)
    }
    if ('color' in this.encoding) {
      this.encoding.color = colorEncodingFactory.create(this.encoding.color as any, this)
    }
    if ('strokeColor' in this.encoding) {
      this.encoding.strokeColor = colorEncodingFactory.create(this.encoding.strokeColor, this, false)
    }
    if ('position' in this.encoding) {
      this.encoding.position = new PositionEncodingImpl(this.encoding.position)
    }
    if ('icon' in this.encoding) {
      this.encoding.icon = new IconEncodingImpl(this.encoding.icon)
    }
  }


  abstract getDefaultEncodings(): EncodingName[];

  getDefaultSize(): any {
    return undefined
  }

  getDefaultColor(): any {
    return '#000000'
  }

  getBaseQueryKey(): QueryKey {
    return QueryKey.baseFromData(this.data)
  }

  getQueryKey(): QueryKey {
    return QueryKey.fromData(this.data)
  }

  getPositionQueryKey(): QueryKey {
    return QueryKey.fromData(this.encoding.position.data)
  }

  getQueryKeys(): QueryKeys {
    const queryKeys = new QueryKeys()
    queryKeys.push(this.getQueryKey())

    if (this.data.transform) {
      queryKeys.push(QueryKey.baseFromData(this.data))
    }

    // Include the query key from the position encoding
    if (this.encoding.position?.data) {
      queryKeys.push(QueryKey.fromData(this.encoding.position.data))

      if (this.encoding.position?.data.transform) {
        queryKeys.push(QueryKey.baseFromData(this.encoding.position?.data))
      }
    }

    return queryKeys
  }
}
