import type {LoaderContext} from '@loaders.gl/loader-utils'
import { parseToImageBitmap, safeCreateImageBitmap } from './ParseToImageBitmap'
import { parseToImage } from './ParseToImage'
import { getDefaultImageType, ImageLoaderOptions, isImageTypeSupported } from '@loaders.gl/images'
import { Texture2D } from '@luma.gl/core'
import GL from '@luma.gl/constants'
import { Logger } from '@hopara/internals'

type ParseImageOptions = ImageLoaderOptions & {size?: {width: number, height: number}, context?: any}

const DEFAULT_TEXTURE_PARAMETERS = {
  [GL.TEXTURE_MIN_FILTER]: GL.LINEAR_MIPMAP_LINEAR,
  [GL.TEXTURE_MAG_FILTER]: GL.LINEAR,
  [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
  [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
}

// Get a loadable image type from image type
function getLoadableImageType(type) {
  switch (type) {
    case 'auto':
    case 'data':
      // Browser: For image data we need still need to load using an image format
      // Node: the default image type is `data`.
      return getDefaultImageType()
    default:
      // Throw an error if not supported
      isImageTypeSupported(type)
      return type
  }
}

const getImage = async (arrayBuffer: ArrayBuffer, options: ImageLoaderOptions, url?: string) => {
  const imageType = getLoadableImageType(options.image?.type ?? 'auto')
  if (imageType === 'imagebitmap') {
    return parseToImageBitmap(arrayBuffer, options, url)
  }
  return parseToImage(arrayBuffer, options, url)
}

const getRatio = (width?: number, height?: number) => width && height ? Number((width / height).toFixed(2)) : 0

export const getTextureParameters = (image: ImageBitmap | HTMLImageElement, boundsRatio: number) => {
  const isBoundsHorizontal = boundsRatio > 1
  const isBoundsVertial = boundsRatio < 1
  const isSquareBounds = boundsRatio === 1
  const biggestSide = Math.max(image.width, image.height)

  return {
    width: isSquareBounds ? biggestSide : isBoundsVertial ? Math.round(image.height * boundsRatio) : image.width,
    height: isSquareBounds ? biggestSide : isBoundsHorizontal ? Math.round(image.width / boundsRatio) : image.height,
    parameters: DEFAULT_TEXTURE_PARAMETERS,
  }
}

export const getResizeImageParameters = (image: ImageBitmap | HTMLImageElement, textureParams: {width: number, height: number}) => {
  const imageFitsTexture = image.width <= textureParams.width && image.height <= textureParams.height
  if (imageFitsTexture) return {width: image.width, height: image.height}

  
  const shouldFitWidth = image.width > textureParams.width
  const shouldFitHeight = image.height > textureParams.height
  const newWidth = shouldFitWidth ? textureParams.width : Math.round(textureParams.height * (image.width / image.height))
  const newHeight = shouldFitHeight ? textureParams.height : Math.round(textureParams.width * (image.height / image.width))
  return {width: newWidth, height: newHeight}
}

const getResizedImage = (image: ImageBitmap | HTMLImageElement, boundsRatio: number, options: any) => {
  try {
    const textureParams = getTextureParameters(image, boundsRatio)

    const canvasCtx = document.createElement('canvas').getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D

    const {width, height} = getResizeImageParameters(image, textureParams)
    const xPosition = Math.round((textureParams.width - width) / 2)
    const yPosition = Math.round((textureParams.height - height) / 2)

    canvasCtx.canvas.width = textureParams.width
    canvasCtx.canvas.height = textureParams.height

    canvasCtx.clearRect(0, 0, textureParams.width, textureParams.height)
    canvasCtx.drawImage(
      image,
      0, 0, image.width, image.height,
      xPosition, yPosition, width, height,
    )
    

    return safeCreateImageBitmap(canvasCtx.canvas, options.imagebitmap)
  } catch (e: any) {
    Logger.error(e)
    return image
  }
}

const shouldResizeImage = (imageRatio?: number, boundsRatio?: number): boolean => {
  return !!imageRatio && !!boundsRatio && imageRatio != boundsRatio
}

export async function parseImage(
  arrayBuffer: ArrayBuffer,
  options: ParseImageOptions = {},
  context?: LoaderContext,
): Promise<ImageBitmap | HTMLImageElement | Texture2D> {
  options = options || {}

  const {url} = context || {}

  let image = await getImage(arrayBuffer, options, url)

  const boundsRatio = getRatio(options.size?.width, options.size?.height)
  const imageRatio = getRatio(image.width, image.height)
  
  if (shouldResizeImage(imageRatio, boundsRatio)) image = await getResizedImage(image, boundsRatio, options)

  return image
}
