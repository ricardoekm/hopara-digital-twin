export const getAttributesDeep = (value: any | undefined, attribute: string): any => {
  if ( !value ) {
    return []
  }

  if (Array.isArray(value)) {
    return (value as any).flatMap((v:any) => getAttributesDeep(v, attribute)).filter((name:any) => !!name)
  } else if (typeof value === 'object') {
    return (Object.keys(value) as any).flatMap((o:any) => {
      const objValue = value[o]
      if (o === attribute) {
        return objValue
      } else if (Array.isArray(objValue) || typeof objValue === 'object') {
        return getAttributesDeep(objValue, attribute)
      }
      return []
    }).filter((name:any) => !!name)
  }

  return []
}
