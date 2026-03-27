
import supertest from 'supertest'
import {HttpServer, UserInfo} from '@hopara/http-server'
import {containerFactory, destroyContainer} from '../../container.js'
import {getFakeId, getToken} from '../../../test/test-helper.js'
import {AwilixContainer} from 'awilix'
import VisualizationRepository from '../repository/visualization-repository.js'

let server: HttpServer
let accessToken: string
let container: AwilixContainer

const anyUserInfo = {email: 'any-email', authorization: 'any-token', tenant: 'hopara.io'} as UserInfo

describe('update-visualization-route', () => {
  beforeAll(async () => {
    container = await containerFactory({logger: {level: 'error'}})
    server = await container.resolve<HttpServer>('server')
    await server.start()
    accessToken = await getToken(container)
  })

  afterAll(async () => {
    await destroyContainer(container)
  })

  it('should return 400 the visualization is invalid', async () => {
    const response = await supertest(server.server)
      .put('/visualization/dummy')
      .send({
        $schema: 'https://schema.hopara.app/app/0.2',
        visualizations: [],
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response).toMatchObject({
      status: 400,
      body: [{
        message: 'Missing property "name". path: ',
        range: {
          end: {'character': 1, 'line': 0},
          start: {'character': 0, 'line': 0},
        },
        severity: 2,
      }],
    })
  })

  it('should return 200 the visualization is valid', async () => {
    const id = getFakeId()
    const res = await supertest(server.server)
      .put(`/visualization/${id}`)
      .send({
        $schema: 'https://schema.hopara.app/app/0.49',
        name: 'dummy',
        type: 'GEO',
        layers: [],
      })
      .set('Authorization', `Bearer ${accessToken}`)
    expect(res).toMatchObject({
      body: {
        name: 'dummy',
      },
      status: 200,
    })
    const visualization = await container.resolve<VisualizationRepository>('visualizationRepository').get(id, anyUserInfo)
    expect(visualization).toBeDefined()
  })
})
