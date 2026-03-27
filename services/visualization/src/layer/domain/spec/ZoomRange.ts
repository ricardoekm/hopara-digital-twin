export interface ZoomValue {
  /**
   * @description A fixed zoom value
  **/
  value?: number

  /**
   * @description The row field to be used to fit to the view
  **/
  field?: string

  /**
  * @description Number to be incremented on referenced zoom value.
  **/
  increment?: number

  /**
  * @description Extra padding in percent to be added to the screen
  **/
  padding?: number
}

export interface ZoomRange {
  min?: ZoomValue
  max?: ZoomValue
}
