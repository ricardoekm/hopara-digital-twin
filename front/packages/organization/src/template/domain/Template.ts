import {i18n} from '@hopara/i18n'

export class Template {
  id: string

  constructor(templateId: string) {
    this.id = templateId
  }

  getName(): string {
    return i18n(this.id.toUpperCase() as any)
  }
}
