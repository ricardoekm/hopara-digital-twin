
let sessionId

export function getSessionId() {
  if (!sessionId) {
    sessionId = window.btoa(Date.now().toString())
  }

  return sessionId
}
