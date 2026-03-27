export function getDomain(str?:string) : string {
  const index = str ? str.lastIndexOf('@') : -1
  if (index != -1) {
    return str!.substring(index + 1)
  }

  return str!
}
