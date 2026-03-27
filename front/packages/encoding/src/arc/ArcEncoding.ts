import { BaseEncoding } from '../BaseEncoding'

export class ArcEncoding extends BaseEncoding<ArcEncoding> {
  field?: string

  constructor(props?: Partial<ArcEncoding>) {
    super()
    Object.assign(this, props)
  }

  getField(): string | undefined {
    return this.field
  }

  setField(fieldName:string): void {
    this.field = fieldName
  }

  isRenderable(): boolean {
    return !!this.field
  }
}
