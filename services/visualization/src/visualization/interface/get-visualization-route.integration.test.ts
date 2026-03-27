import supertest from 'supertest'
import {HttpServer, UserInfo} from '@hopara/http-server'
import {containerFactory, destroyContainer} from '../../container.js'
import {getFakeId, getToken} from '../../../test/test-helper.js'
import {AwilixContainer} from 'awilix'
import VisualizationRepository from '../repository/visualization-repository.js'
import {VisualizationFactory} from '../domain/factory/visualization-factory.js'
import {VisualizationType} from '../domain/spec/Visualization.js'
import {getSchemaId} from '../../schema/schema-repository.js'

let server: HttpServer
let accessToken: string
let container: AwilixContainer
let visualizationRepository: VisualizationRepository

const anyUserInfo = {email: 'any-email', authorization: 'any-token', tenant: 'hopara.io'} as UserInfo

describe('get-visualization-route', () => {
  beforeAll(async () => {
    container = await containerFactory({logger: {level: 'error'}})
    server = container.resolve<HttpServer>('server')
    await server.start()
    accessToken = await getToken(container)
    visualizationRepository = container.resolve<VisualizationRepository>('visualizationRepository')
  })

  afterAll(async () => {
    await destroyContainer(container)
  })

  it('should return 200 the visualization is valid', async () => {
    const id = getFakeId()
    await visualizationRepository.upsert(VisualizationFactory.fromSpec({
      id,
      name: id,
      type: VisualizationType.GEO,
      $schema: getSchemaId(),
    }), anyUserInfo)

    const res = await supertest(server.server)
      .get(`/visualization/${id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(res).toMatchObject({
      body: {
        name: id,
      },
      status: 200,
    })
  })

  it('should return 200 the visualization and version is valid', async () => {
    const id = getFakeId()
    await visualizationRepository.upsert(VisualizationFactory.fromSpec({
      $schema: getSchemaId(),
      id,
      name: id,
      type: VisualizationType.GEO,
    }), anyUserInfo)

    const res = await supertest(server.server)
      .get(`/visualization/${id}?version=1`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(res).toMatchObject({
      body: {
        name: id,
      },
      status: 200,
    })
  })
})
