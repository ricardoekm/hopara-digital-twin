export function inferFieldsFromLayers(layers: any, fields = [] as any[]): string[] {
  Object.values(layers).forEach((value) => {
    if (value === null || value === undefined) {
      return
    }
    if (typeof value === 'object') {
      inferFieldsFromLayers(value, fields)
    } else if (typeof value === 'string' && value.startsWith('{{') 
              && value.endsWith('}}') && !value.includes('id#')) {
      fields.push(value.slice(2, -2))
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        inferFieldsFromLayers(item, fields)
      })
    }
  })
  // remove duplicates using set
  return [...new Set(fields)]
}
