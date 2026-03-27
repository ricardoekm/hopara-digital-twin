export function inferFieldPath(data: any, fieldName: string, path = ''): string {
  if (Array.isArray(data)) {
    let newPath: string| undefined
    data.forEach((item, index) => {
      if (!newPath) {
        newPath = inferFieldPath(item, fieldName, `${path}[${index}]`)
      }
    })
    if (newPath) {
      return newPath
    }
  } else if (typeof data === 'object') {
    for (const key in data) {
      if (data[key] === `{{${fieldName}}}`) {
        return path ? `${path}.${key}` : key
      }
      const result = inferFieldPath(data[key], fieldName, path ? `${path}.${key}` : key)
      if (result) {
        return result
      }
    }
  }
  return ''
}
