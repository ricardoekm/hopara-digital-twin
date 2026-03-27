import {ImageLoader} from '@loaders.gl/images'

export const IconLoader = {
  ...ImageLoader,
  parse: async (arrayBuffer, options, context) => {
    const filename = context.response?.headers['content-disposition']?.split('filename=')[1]
    return {image: await ImageLoader.parse(arrayBuffer, options, context), filename}
  },
}
