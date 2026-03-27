export class Etag {
  value: string
  modifiers: Record<string, any>

  constructor(value:string) {
    this.value = value ?? ''
    this.modifiers = {}
  }

  updateModifier(key:string, value?:string) {
    this.modifiers[key] = value
  }

  getValue() : string {
    const values = Object.values(this.modifiers)
    values.unshift(this.value)

    return values.join('#')
  }

  clone() {
    const cloned = new Etag('')
    cloned.value = this.value
    cloned.modifiers = {...this.modifiers}
    return cloned
  }
}
