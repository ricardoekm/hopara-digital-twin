import {isSVG, getBlob} from './SvgUtils'
import {parseToImage} from './ParseToImage'
import { ImageLoaderOptions } from '@loaders.gl/images'

const EMPTY_OBJECT = {}

let imagebitmapOptionsSupported = true

function isEmptyObject(object) {
  for (const key in object || EMPTY_OBJECT) {
    return false
  }
  return true
}

export async function safeCreateImageBitmap(
  image: Blob | HTMLCanvasElement,
  imagebitmapOptions: ImageBitmapOptions | null = null,
): Promise<ImageBitmap> {
  if (isEmptyObject(imagebitmapOptions) || !imagebitmapOptionsSupported) {
    imagebitmapOptions = null
  }

  if (imagebitmapOptions) {
    try {
      return await createImageBitmap(image, imagebitmapOptions)
    } catch (error) {
      console.warn(error); // eslint-disable-line
      imagebitmapOptionsSupported = false
    }
  }

  return await createImageBitmap(image)
}

export async function parseToImageBitmap(
  arrayBuffer: ArrayBuffer,
  options: ImageLoaderOptions,
  url?: string,
): Promise<ImageBitmap> {
  let blob

  // Cannot parse SVG directly to ImageBitmap, parse to Image first
  if (isSVG(url)) {
    // Note: this only works on main thread
    const image = await parseToImage(arrayBuffer, options, url)
    blob = image
  } else {
    // Create blob from the array buffer
    blob = getBlob(arrayBuffer, url)
  }

  const imagebitmapOptions = options && options.imagebitmap

  return await safeCreateImageBitmap(blob, imagebitmapOptions)
}


