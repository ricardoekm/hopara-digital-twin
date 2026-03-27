export interface RotationFieldEncoding {
  field: string
}

export interface RotationEncoding {
  x: RotationFieldEncoding
  y: RotationFieldEncoding
  z: RotationFieldEncoding
  value?: [number, number, number]
}
