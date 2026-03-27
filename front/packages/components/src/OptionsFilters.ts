import {Column, ColumnType} from '@hopara/dataset'

export const visibilityOptionsFilter = (c: Column) => (c.isQuantitative() || 
                                                        c.type == ColumnType.STRING || 
                                                        c.type === ColumnType.BOOLEAN) 
                                                        && !c.isPrimaryKey()    

export const sizeOptionsFilter = (c: Column) => c.isQuantitative()

export const notComplexOptionsFilter = (c: Column) => !c.isComplex()

export const colorOptionsFilter = notComplexOptionsFilter

export const resourceOptionsFilter = (c: Column) => c.isType(ColumnType.STRING) || c.isType(ColumnType.INTEGER)

const filters = {
  '.condition.test': visibilityOptionsFilter,
  '.condition.test.field': visibilityOptionsFilter,
  '.animation': visibilityOptionsFilter,
  '.encoding.arc.field': sizeOptionsFilter,
  '.encoding.strokeSize.field': sizeOptionsFilter,
  '.encoding.offset.x.field': sizeOptionsFilter,
  '.encoding.offset.y.field': sizeOptionsFilter,
  '.encoding.size.field': sizeOptionsFilter,
  '.encoding.text.field': notComplexOptionsFilter,
  '.encoding.image.field': resourceOptionsFilter,
  '.encoding.model.field': resourceOptionsFilter,
  '.encoding.icon.field': resourceOptionsFilter,
  '.encoding.color.field': notComplexOptionsFilter,
  '.encoding.strokeColor.field': notComplexOptionsFilter,
}

export function getFieldOptionsFromPath(fieldPath: string) {
  const key = Object.keys(filters).find((key) => fieldPath.endsWith(key))
  return key ? filters[key] : undefined
}
