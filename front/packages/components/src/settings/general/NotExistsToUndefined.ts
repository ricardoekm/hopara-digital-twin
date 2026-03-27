export function notExistsToUndefined(object:Record<string, any>, keys:string[]) {
  keys.forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(object, key)) {
      object[key] = undefined
    }
  })
  return object
}
