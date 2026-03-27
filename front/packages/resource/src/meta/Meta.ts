import {createResourceURL, ResourceType} from '../fetch'

type Meta = {
  width: number
  height: number
  ratio: number
}

export const getMetaFromResourceResponse = ({width = 1, height = 1}: any) => {
  return {
    width,
    height,
    ratio: height / width,
  }
}

export const getMeta = async (imageURI: string, library: string | undefined, tenant = ''): Promise<Meta> => {
  return new Promise((resolve, reject) => {
    if (!imageURI) return reject(new Error('invalid imageURI'))

    const url = createResourceURL({id: imageURI, library, tenant, format: 'json', resourceType: ResourceType.image})
    return fetch(url.toString(), tenant ? {headers: {tenant}} : {})
      .then((response) => response.json())
      .then((meta) => getMetaFromResourceResponse(meta))
      .then((info) => resolve(info))
      .catch((error) => reject(error))
  })
}
