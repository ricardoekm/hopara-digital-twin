import { geti } from '@hopara/dataset'
import {IconEncoding} from './IconEncoding'
import { testCondition } from '../condition/Condition'
import { isNil } from 'lodash/fp'

export type Icon = {
  url: string
  width: number
  height: number
  anchorY?: number
  mask?: boolean
}

export const DEFAULT_ICON = 'map-marker'

export class IconAccessor {
  static getIconUrlPath(encoding:IconEncoding, iconName:string): string {
    const searchParams = new URLSearchParams()
    if (encoding.value && iconName !== encoding.value) searchParams.append('fallback', encoding.value)
    if (encoding.smartSearch === false) searchParams.append('smart-search', 'false')
    
    if (searchParams.toString()) {
      return `${encodeURIComponent(iconName)}?${searchParams.toString()}`
    } else {
      return encodeURIComponent(iconName)
    }
  }

  static doGetIcon(encoding: IconEncoding, row: any) {
    if (encoding.field) {
      const rowValue = geti(encoding.field, row)
      if (!isNil(rowValue)) {
        return rowValue
      } else if (encoding.value) {
        return encoding.value
      }
    } else if (encoding?.value) {
      return encoding?.value
    }

    return DEFAULT_ICON
  }

  static buildResponse(iconUrlPath:string) {
     return {url: iconUrlPath}
  }

  static getIcon(encoding: IconEncoding | undefined, row: any) {
    if (!encoding) {
      return this.buildResponse(encodeURIComponent(DEFAULT_ICON))
    } 

    if (encoding.hasCondition()) {
      for (const condition of encoding.conditions!) {
        if (testCondition(condition, row)) {
          return this.getIcon(new IconEncoding(condition), row)
        }
      }
    }

    let icon = this.doGetIcon(encoding, row)
    if (encoding?.map && geti(icon, encoding.map)) {
      icon = geti(icon, encoding.map)
    }

    return this.buildResponse(IconAccessor.getIconUrlPath(encoding, icon))
  }
}
