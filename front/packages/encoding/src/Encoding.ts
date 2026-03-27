export interface Encoding {
  isRenderable() : boolean
  getCreatedTimestamp() : number
  getUpdatedTimestamp() : number
}

export enum EncodingScope {
  QUERY = 'QUERY',
  FETCH = 'FETCH'
}
