//
// Filter the details to be shown and format accordingly
//
import {Column, Columns, Rows} from '@hopara/dataset'
import {Debug} from '@hopara/internals'
import {isNil} from 'lodash/fp'
import {Details} from './Details'
import {createDetailsFromColumns} from './DetailsFactory'
import {DetailsLine} from './DetailsLine'
import {DetailsField} from './DetailsField'
import {ColorEncoding, getColorAccessorInstance, ImageEncoding, TextEncoding} from '@hopara/encoding'
import {ResourceType, createResourceURL} from '@hopara/resource'

const getRowColumn = (columns: Columns, name: string): Column => {
  if (columns.has(name)) {
    return columns.get(name) as Column
  }

  return new Column({name})
}

function getTitle(item: DetailsField, columns: Columns) {
  if (item.title) {
    return item.title
  }

  const field = item.value.encoding.text?.field
  if (field) {
    const column = getRowColumn(columns, field)
    if (column) {
      return column.getLabel()
    }
  }

  return ''
}

export function getTextValue(row: any, columns: Columns, encoding?: TextEncoding) {
  if (!encoding?.field) {
    return undefined
  }

  const column = getRowColumn(columns, encoding.field)
  return encoding.getValue(row, column?.getType())
}

function getImageUrl(row: any, tenant: string, encoding?: ImageEncoding) {
  if (!encoding?.field) {
    return undefined
  }

  return createResourceURL({
    id: encoding.getId(row),
    fallback: encoding.getFallback(row),
    library: encoding.scope,
    tenant,
    resourceType: ResourceType.image,
    resolution: 'sm',
  })?.toString()
}

function getColor(row: any, columns: Columns, encoding?: ColorEncoding) {
  if (!encoding) {
    return undefined
  }

  const accessor = getColorAccessorInstance(encoding)
  return accessor.getColor(new Rows(row), row, columns.get(encoding.field ? encoding.field : undefined))
}

export const createLine = (row: any, columns: Columns, item: DetailsField, tenant: string): DetailsLine => {
  const line = {title: getTitle(item, columns)}
  line['value'] = getTextValue(row, columns, item.value.encoding.text)
  line['image'] = getImageUrl(row, tenant, item.value.encoding.image)
  line['color'] = getColor(row, columns, item.value.encoding.color)
  return line
}

export const expandDetails = (details: Details, columns: Columns, rowColumns: string[]): DetailsField[] => {
  if (!details.fields || !details.fields.length) {
    const printableColumns = columns.getPrintables()
    return createDetailsFromColumns(new Columns(...printableColumns), rowColumns)
  } else if (Array.isArray(details.fields)) {
    if (Debug.isDebugging()) return details.fields
    return details.fields.filter((field) => field.visible)
  }
  return []
}

export const createDetailLines = (row: any, tenant: string, columns?: Columns, details?: Details, titleField?: string): DetailsLine[] => {
  if (isNil(details)) {
    details = new Details()
  }

  if (isNil(columns)) {
    columns = new Columns()
  }

  return expandDetails(details, columns, Object.keys(row))
    .filter((field) => field.getField() !== titleField)
    .map((field) => createLine(row, columns as Columns, field, tenant))
}
