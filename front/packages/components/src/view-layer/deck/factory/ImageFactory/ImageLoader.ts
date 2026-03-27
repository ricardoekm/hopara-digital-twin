import { parseImage } from '@hopara/resource'
import { getBinaryImageMetadata, ImageType } from '@loaders.gl/images'
import type {LoaderOptions} from '@loaders.gl/loader-utils'

const EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'svg', 'avif']
const MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/bmp',
  'image/vnd.microsoft.icon',
  'image/svg+xml',
]

export type ImageLoaderOptions = LoaderOptions & {
  image?: {
    type?: 'auto' | 'data' | 'imagebitmap' | 'image';
    decode?: boolean;
  };
  imagebitmap?: ImageBitmapOptions;
};

const DEFAULT_IMAGE_LOADER_OPTIONS: ImageLoaderOptions = {
  image: {
    type: 'auto',
    decode: true, // if format is HTML
  },
  imagebitmap: {
    premultiplyAlpha: 'premultiply', // we need to premultiply alpha for blend func
  },
}

export const ImageLoader = {
  dataType: null as unknown as ImageType,
  batchType: null as never,
  id: 'image',
  module: 'images',
  name: 'Images',
  mimeTypes: MIME_TYPES,
  extensions: EXTENSIONS,
  parse: parseImage,
  tests: [(arrayBuffer) => Boolean(getBinaryImageMetadata(new DataView(arrayBuffer)))],
  options: DEFAULT_IMAGE_LOADER_OPTIONS,
}


