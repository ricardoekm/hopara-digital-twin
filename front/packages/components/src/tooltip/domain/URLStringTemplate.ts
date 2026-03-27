import queryString from 'query-string'
import {isEmpty, mapKeys, mapValues} from 'lodash/fp'
import {Row} from '@hopara/dataset'

const getLocation = (href:string) => {
  const match = href.match(/^((https|http)?:\/\/(([^:/?#]*)(?::([0-9]+))?))?([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/)
  return match && {
      origin: match[1] || '',
      protocol: match[2] || '',
      host: match[3] || '',
      hostname: match[4] || '',
      port: match[5] || '',
      pathname: match[6] || '',
      search: match[7] || '',
      hash: match[8] || '',
  }
}

const replaceValue = (value:string, row?: Row) => {
  if (value.startsWith(':')) {
    const columnName = value.replace(':', '')
    return row?.getValue(columnName) ?? ''
  }
  return value
}

const replacePathWithRowValues = (path: string, row?: Row): string => {
  const splittedPath = path.split('/')
  if (!splittedPath.length) return ''

  const replecedPath = splittedPath.map((value) => replaceValue(value, row))

  return replecedPath.join('/')
}

const replaceSearchWithRowValues = (search: string, row?: Row): string => {
  if (!search) return ''
  
  const parsedSearch = queryString.parse(search)
  if (isEmpty(parsedSearch)) return ''

  const searchWithReplacedKeys = mapKeys((k:string) => replaceValue(k, row), parsedSearch)
  const searchWithReplecedValues = mapValues((v:string) => replaceValue(v, row), searchWithReplacedKeys)

  const searchStringifyed = queryString.stringify(searchWithReplecedValues)
  return searchStringifyed ? `?${searchStringifyed}` : ''
}

export class URLStringTemplate {
  origin = ''
  protocol = ''
  host = ''
  hostname = ''
  port = ''
  pathname = ''
  search = ''
  hash = ''

  constructor(href?: string) {
    Object.assign(this, href ? getLocation(href) : undefined)
  }

  clone(): URLStringTemplate {
    const cloned = new URLStringTemplate()
    Object.assign(cloned, this)
    return cloned
  }

  getValue():string {
    return `${this.origin}${this.pathname}${this.search}${this.hash}`
  }

  getCompiledValue(row?:Row): string {
    const cloned = this.clone()
    cloned.pathname = replacePathWithRowValues(this.pathname, row)
    cloned.search = replaceSearchWithRowValues(this.search, row)
    return cloned.getValue()
  }
}
