import {HttpServer} from '@hopara/http-server'
import 'reflect-metadata'
import {containerFactory} from './container';

(async () => {
  // eslint-disable-next-line no-console
  console.log(`
   ▀ ▀██▄     █
 ▀ ▀ ▀████ ▄▄ █▀▀▄  ▄▀▀  ▄▀▀
 ▀ ▀ ▀███▀    █  █ ▀█▀▀ ▀█▀▀
   ▀ ▀▀▀      ▀▀▀   █    █
`)
  const container = await containerFactory()
  await container.resolve<HttpServer>('server').start()
})()
