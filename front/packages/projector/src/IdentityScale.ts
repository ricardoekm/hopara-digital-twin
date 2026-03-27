export function IdentityScale(value) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function unproject(value) {
    return value
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function invert(value) {
    return value
  }
  return value
}

IdentityScale.unproject = function(value) {
  return value
}

IdentityScale.invert = function(value) {
  return value
}
