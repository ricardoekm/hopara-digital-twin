export function isVersionGte(versionA?: string, baseVersionB?: string): boolean {
  if ( !versionA || !baseVersionB ) {
    return false
  }

  const [majorA, minorA] = versionA.split('.')
  const [majorB, minorB] = baseVersionB.split('.')

  if (majorA > majorB) {
    return true
  } else if (majorA === majorB) {
    return minorA >= minorB
  }

  return false
}
