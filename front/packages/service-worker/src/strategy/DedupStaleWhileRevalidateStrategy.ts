import { StaleWhileRevalidate } from 'workbox-strategies'

export class DedupStaleWhileRevalidateStrategy extends StaleWhileRevalidate {
  requestsInProgress = new Map()

  async _handle(request, handler) {
    const requestInProgress = this.requestsInProgress.get(request.url)

    if (requestInProgress) {
      const dedupedResponse = await requestInProgress.promise
      return dedupedResponse.clone()
    }

    let done
    this.requestsInProgress.set(request.url, {
      promise: new Promise((resolve) => {
        done = resolve
      }),
      done,
    })

    const response = await super._handle(request, handler)
    done(response.clone())
    this.requestsInProgress.delete(request.url)
    return response
  }
}
