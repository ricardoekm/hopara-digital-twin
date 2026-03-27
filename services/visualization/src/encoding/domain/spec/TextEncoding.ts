export enum HoparaAlign {
  left = 'left',
  center = 'center',
  right = 'right',
}

type SuffixEncoding = {
  field?: string,
  value?: string
}

export enum MaxLengthLimitType {
  NONE = 'NONE',
  FIXED = 'FIXED',
  AUTO = 'AUTO',
}

export type MaxLength = {
  value?: number,
  /**
  * @default NONE
  */
  type: MaxLengthLimitType
}

export interface TextEncoding {
  field?: string
  value?: string
  /**
   * @default center
   */
  align?: HoparaAlign

  map?: any

  suffix?: SuffixEncoding
  prefix?: SuffixEncoding
  format?: string
  /**
  * @default 400
  */
  weight?: number
  maxLength?: MaxLength

  /**
  * @default 0
  */
  angle?: number

  conditions?: TextCondition[]
}

export interface TextCondition extends TextEncoding {
  test: {
    field?: string,
    value?: string | number,
    reverse?: boolean
  }
}
