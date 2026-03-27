import { LineEncoding } from '@hopara/encoding'

export class VegaLineTranslator {
  translate(lineEncoding?:LineEncoding) : any {
    if (lineEncoding?.group) {
      return { 
        detail: { 
          field: lineEncoding.group.field,
          type: 'nominal',
        },
      }
    }

    return {}
  }
}
