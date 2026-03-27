export function unique<T>(array:T[]): T[] {
  return array.filter((value:T, index:number) => array.indexOf(value) === index)
}
