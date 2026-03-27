export enum LineCap {
  BUTT = 'butt',
  ROUND = 'round',
}

export interface LineEncoding {
  /**
   * @default 'butt'
   */
  cap?: LineCap
  /**
   * @default 500
   */
  segmentLength?: number

  group?: {
    field: string
  }
}
