import {HttpServer} from '@hopara/http-server'
import 'reflect-metadata'
import {containerFactory} from './container'

process.on('unhandledRejection', (reason: any, promise) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
});

(async () => {
  // eslint-disable-next-line no-console
  console.log(`
   ▀ ▀██▄      █                   █       █
 ▀ ▀ ▀████ ▄▄ ▀█▀▀ ▄▀▀▄ █▀█▀▄ █▀▀▄ █ ▄▀▀█ ▀█▀▀ ▄▀▀▄
 ▀ ▀ ▀███▀     █   █▀▀▀ █ █ █ █▄▄▀ █ █  █  █   █▀▀▀
   ▀ ▀▀▀        ▀▀  ▀▀▀ ▀ ▀ ▀ █    ▀  ▀▀▀   ▀▀  ▀▀▀
`)
  const container = await containerFactory()
  await container.resolve<HttpServer>('server').start()
})()
