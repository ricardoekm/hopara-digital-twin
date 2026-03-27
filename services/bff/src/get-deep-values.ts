export const getDeepValues = (paramName: string, obj: any): any[] => {
  if (!obj) return []

  return Object.keys(obj)
    .flatMap((key) => {
      if (key === paramName) return obj[key]
      if (typeof obj[key] === 'object') return getDeepValues(paramName, obj[key])
      return undefined
    })
    .filter((value) => !!value)
}
