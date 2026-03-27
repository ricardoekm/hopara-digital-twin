import { TextEncoding } from '../text/TextEncoding'

export type TableField = {
  title?: string
  value: {
    encoding: {
      text: TextEncoding
    }
  }
}

export type TableEncoding = TableField[]
