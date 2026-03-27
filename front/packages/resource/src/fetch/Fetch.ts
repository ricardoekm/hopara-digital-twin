import {ResourceType} from './ResourceType'
import {FetchProgressCallback} from './FetchResource'

export const handleFetchProgressCallback = async (
  key: string,
  fetchEntity: ResourceType,
  response: Response,
  callback: FetchProgressCallback,
) => {
  let receivedBytes = 0
  const contentLength = Number(response.headers.get('Content-Length') ?? 0)
  const reader = response?.clone().body?.getReader() as ReadableStreamDefaultReader<Uint8Array>
  let startTime: number

  return new ReadableStream({
    async start(controller) {
      function notify(key: string, fetchEntity: ResourceType, percentComplete?: number) {
        if (!startTime) {
          startTime = new Date().getTime()
          return
        }

        const currentTime = new Date().getTime()
        if ((currentTime - startTime) > 500) {
          callback(key, fetchEntity, percentComplete)
        }
      }

      function processResult(result: ReadableStreamReadResult<Uint8Array>) {
        receivedBytes += result.value?.length ?? 0
        const percentComplete = (receivedBytes / contentLength) * 100

        if (result.done || percentComplete === 100 || contentLength === 0) {
          controller.close()
          notify(key, fetchEntity, percentComplete)
          setTimeout(() => notify(key, fetchEntity), 100)
          return
        }

        // Update the progress percentage
        notify(key, fetchEntity, percentComplete)

        // Continue fetching the remaining content
        controller.enqueue(result.value)
        return reader.read().then((a) => processResult(a))
      }

      return reader.read().then(processResult)
    },
  })
}
