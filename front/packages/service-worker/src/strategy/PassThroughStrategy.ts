import { HandlerCallbackOptions } from 'workbox-core'

export class PassThroughStrategy {
  plugins: any[]

  constructor({ plugins }) {
    this.plugins = plugins
  }

  getHandleOptions(options: any) {
    return {
      ...options,
      event: options,
      request: typeof options.request === 'string' ? new Request(options.request) : options.request,
    }
  }

  executePlugins(options: FetchEvent | HandlerCallbackOptions) {
    const handleOptions = this.getHandleOptions(options)
    return Promise.all(this.plugins.map((plugin) => plugin.fetchDidSucceed({request: handleOptions.request})))
  }

  handle(options: FetchEvent | HandlerCallbackOptions): any {
    this.executePlugins(options)
    return null
  }
}
