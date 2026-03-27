export interface OffsetAxisEncoding {
  /**
   * @description The size in pixels. If field is specified, this value will be used as a fallback.
   * @default 0
  */
  value?: number

  /**
   * @description The field to use as a offset value.
  */
  field?: string

  /**
  * @description Used as pixel reference if resize is true
  */
  referenceZoom?:number
}

export interface OffsetEncoding {
  x?: OffsetAxisEncoding
  y?: OffsetAxisEncoding
}
