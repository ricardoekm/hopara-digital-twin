import React from 'react'
import { Layer } from '../layer/Layer'
import { Row } from '@hopara/dataset'
import { Authorization } from '@hopara/authorization'
import { DetailsLine } from '../details/DetailsLine'
import { LayerType } from '../layer/LayerType'
import { Image } from '@hopara/design-system/src/image/Image'
import { Theme, withTheme } from '@hopara/design-system/src/theme'
import { PureComponent } from '@hopara/design-system'
import { createResourceURL, ResourceType } from '@hopara/resource'
import { ResourceIcon } from '@hopara/design-system/src/icons/ResourceIcon'
import { getIcon, LayerIcon, LayerIconContext } from '../layer/LayerIcon'

export enum ObjectIconContext {
  GENERAL = 'general',
  PLACE = 'place',
  PLACING = 'placing',
}

interface Props {
  layer: Layer,
  row?: Row,
  authorization: Authorization
  size?: number
  maxSize?: number | string
  smMaxSize?: number | string
  detailsLines?: DetailsLine[]
  context?: ObjectIconContext
  lastImageVersionDate?: Date
  placeHolderSize?: number
  parentRef?: React.RefObject<HTMLDivElement>
  resolution?: string
}

const isPlacingTextLayer = (layer: Layer, context?: ObjectIconContext) => {
  return layer.type === LayerType.text && context === ObjectIconContext.PLACING
}

const shouldUseLayerIcon = (layer: Layer, context?: ObjectIconContext) => {
  const isPlaceOrPlacing = !!context && [ObjectIconContext.PLACE, ObjectIconContext.PLACING].includes(context)
  const isAllowedLayerType = [LayerType.polygon, LayerType.line, LayerType.text, LayerType.circle].includes(layer.type)
    || layer.hasType(LayerType.polygon)
  return isPlaceOrPlacing && isAllowedLayerType
}

export const getImageUrl = (props: Props) => {
  if (!props.row) return

  const firstLineWithImage = props.detailsLines?.find((line) => !!line.image)
  if (firstLineWithImage) return firstLineWithImage.image

  const imageEncoding = props.layer.encoding.image
  if (imageEncoding?.isRenderable()) {
    return createResourceURL({
      id: imageEncoding?.getId(props.row),
      fallback: imageEncoding?.getFallback(props.row),
      library: imageEncoding?.scope,
      tenant: props.authorization.tenant,
      resolution: props.resolution ?? 'sm',
      versionDate: props.lastImageVersionDate,
      resourceType: ResourceType.image
    }).toString()
  }

  const modelEncoding = props.layer?.encoding?.model
  if (modelEncoding?.isRenderable()) {
    return createResourceURL({
      id: modelEncoding?.getId(props.row),
      fallback: modelEncoding?.getFallback(props.row),
      library: modelEncoding?.scope,
      tenant: props.authorization.tenant,
      versionDate: props.lastImageVersionDate,
      resourceType: ResourceType.model
    }).toString()
  }
}

class ObjectIconComponent extends PureComponent<Props & { theme: Theme }> {
  render() {
    const size = this.props.size ?? 24
    const imageUrl = getImageUrl(this.props)

    if (this.props.row && imageUrl) {
      return (
        <Image
          src={imageUrl}
          placeHolderSize={this.props.placeHolderSize}
          parentRef={this.props.parentRef}
          resourceType={this.props.layer.isType(LayerType.model) ? ResourceType.model : undefined}
          sx={{
            backgroundColor: 'white',
            maxWidth: '100%',
            maxHeight: this.props.maxSize ?? size * 2,
            objectFit: 'contain',
            display: 'block',
            [this.props.theme.breakpoints.down('sm')]: {
              maxHeight: this.props.smMaxSize ?? size * 2
            }
          }}
        />
      )
    }

    if (isPlacingTextLayer(this.props.layer, this.props.context)) {
      return (
        <div style={{ fontSize: 16 }}>
          {this.props.layer.encoding.text?.getValue(this.props.row)}
        </div>
      )
    }

    if (shouldUseLayerIcon(this.props.layer, this.props.context)) {
      // To show polygons on templates like text box
      const type = this.props.layer.hasType(LayerType.polygon) ? LayerType.polygon : this.props.layer.type
      return (
        <LayerIcon
          type={type}
          isChart={false}
          size={size}
          context={LayerIconContext.OBJECT_EDITOR}
        />
      )
    }

    return (
      <ResourceIcon
        icon={getIcon(this.props.layer, this.props.row)}
        tenant={this.props.authorization.tenant}
        size={size} />
    )
  }
}

export const ObjectIcon = withTheme<Props>(ObjectIconComponent)

