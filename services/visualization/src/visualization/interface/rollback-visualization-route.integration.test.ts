
import supertest from 'supertest'
import {HttpServer} from '@hopara/http-server'
import {containerFactory, destroyContainer} from '../../container.js'
import {getFakeId, getFakeUserInfo, getToken} from '../../../test/test-helper.js'
import {AwilixContainer} from 'awilix'
import VisualizationRepository from '../repository/visualization-repository.js'
import {VisualizationType} from '../domain/spec/Visualization.js'
import {getSchemaId} from '../../schema/schema-repository.js'
import {VisualizationFactory} from '../domain/factory/visualization-factory.js'

let server: HttpServer
let accessToken: string
let container: AwilixContainer
let visualizationRepository: VisualizationRepository

const anyUserInfo = getFakeUserInfo()

describe('rollback-visualization-route', () => {
  beforeAll(async () => {
    container = await containerFactory({logger: {level: 'error'}})
    server = container.resolve<HttpServer>('server')
    visualizationRepository = await container.resolve<VisualizationRepository>('visualizationRepository')
    await server.start()
    accessToken = await getToken(container)
  })

  afterAll(async () => {
    await destroyContainer(container)
  })

  it('should return 200 token is not informed', async () => {
    const fakeId = getFakeId()
    await visualizationRepository.upsert(VisualizationFactory.fromSpec({
      $schema: getSchemaId(),
      id: fakeId, name: 'version1',
      type: VisualizationType.GEO,
    }), anyUserInfo)
    await visualizationRepository.upsert(VisualizationFactory.fromSpec({
      $schema: getSchemaId(),
      id: fakeId,
      name: 'version2',
      type: VisualizationType.GEO,
    }), anyUserInfo)
    await supertest(server.server)
      .put(`/visualization/${fakeId}/rollback`)
      .send({version: 1})
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
  })
})
