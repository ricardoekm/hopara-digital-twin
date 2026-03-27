export function maxBy(array, field) {
  return array.reduce((max, item) => {
    if (max[field] < item[field]) {
      return item
    }
    return max
  })
}

export function deepMax(array): number {
  let max = 0
  array.forEach((item) => {
    if (Array.isArray(item)) {
      const candidate = deepMax(item)
      if (candidate > max) {
        max = candidate
      }
    } else if (item > max) {
        max = item
      }
  })
  return max
}
