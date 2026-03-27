import {ColorEncoding, ImageEncoding, TextEncoding} from '@hopara/encoding'
import {Column} from '@hopara/dataset'

export enum DetailsFieldType {
  TEXT = 'text',
  IMAGE = 'image',
}

interface DetailsFieldEncoding {
  text?: TextEncoding
  image?: ImageEncoding
  color?: ColorEncoding
}

export class DetailsField {
  title?: string
  visible?: boolean
  value: { encoding: DetailsFieldEncoding }
  primaryKey?: boolean

  constructor(props: Partial<DetailsField>) {
    Object.assign(this, props ?? {})
    this.visible = props?.visible ?? true
    if (!this.value) this.value = {encoding: {text: new TextEncoding({})}}
    if (this.value.encoding.text) this.value = this.cloneEncodingWith({text: new TextEncoding(this.value.encoding.text)})
    if (this.value.encoding.image) this.value = this.cloneEncodingWith({image: new ImageEncoding(this.value.encoding.image)})
    if (this.value.encoding.color) this.value = this.cloneEncodingWith({color: new ColorEncoding(this.value.encoding.color)})
  }

  getType(): DetailsFieldType {
    if (this.value?.encoding.text) return DetailsFieldType.TEXT
    if (this.value?.encoding.image) return DetailsFieldType.IMAGE
    return DetailsFieldType.TEXT
  }

  cloneEncodingWith(encoding: any) {
    return {
      ...this.value,
      encoding: {
        ...this.value.encoding,
        ...encoding,
      },
    }
  }

  getLabel(): string {
    if (this.title) return this.title
    return this.value.encoding.text?.field ?? ''
  }

  getTitle(): string {
    return this.title ?? this.value.encoding.text?.field ?? ''
  }

  getField(): string {
    return this.value.encoding.text?.field ?? this.value.encoding.image!.field!
  }

  show() {
    this.visible = true
    return this
  }

  hide() {
    this.visible = false
    return this
  }

  static fromColumn(column: Column): DetailsField {
    return new DetailsField({
      title: column.getLabel(),
      visible: !column.primaryKey,
      primaryKey: column.primaryKey,
      value: {
        encoding: {
          text: new TextEncoding({
            field: column.getName(),
          }),
        },
      },
    })
  }
}
