import {AwilixContainer} from 'awilix'
import {containerFactory, destroyContainer} from '../../container.js'
import {TenantUserBasedTable} from '../../db/tenant-user-based-table.js'
import {VisualizationEntity} from './visualization-entity.js'
import VisualizationRepository from './visualization-repository.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import {getFakeId, getFakeUserInfo} from '../../../test/test-helper.js'
import {VisualizationType} from '../domain/spec/Visualization.js'
import {getSchemaId} from '../../schema/schema-repository.js'
import {VisualizationFactory} from '../domain/factory/visualization-factory.js'

dayjs.extend(utc)

const user1 = getFakeUserInfo('user1@gmail.com')
const user2 = getFakeUserInfo('user2@gmail.com')

let container: AwilixContainer
let visualizationTable: TenantUserBasedTable<VisualizationEntity>
let visualizationHistoryTable: TenantUserBasedTable<VisualizationEntity>
let visualizationRepository: VisualizationRepository

describe('VisualizationRepository', () => {
  beforeAll(async () => {
    container = await containerFactory({logger: {level: 'error'}})
    visualizationTable = container.resolve<TenantUserBasedTable<VisualizationEntity>>('visualizationTable')
    visualizationHistoryTable = container.resolve<TenantUserBasedTable<VisualizationEntity>>('visualizationHistoryTable')
    visualizationRepository = container.resolve<VisualizationRepository>('visualizationRepository')
  })

  afterAll(async () => {
    await destroyContainer(container)
  })

  test('get', async () => {
    const id = getFakeId()
    await visualizationTable.insert({id, name: 'dummy'}, user1)
    const dbApp = await visualizationRepository.get(id, user1)
    expect(dbApp).toMatchObject({
      id,
      name: 'dummy',
    })
  })

  test('exists', async () => {
    const id = getFakeId()
    await visualizationTable.insert({id, name: 'dummy'}, user1)
    const exists = await visualizationRepository.exists(id, user1)
    expect(exists).toEqual(true)
  })

  describe('upsert', () => {
    it('success', async () => {
      const id = getFakeId()
      await visualizationRepository.upsert(VisualizationFactory.fromSpec({
        $schema: getSchemaId(),
        id,
        name: 'dummy1',
        type: VisualizationType.GEO,
      }), user1)
      await visualizationRepository.upsert(VisualizationFactory.fromSpec({
        $schema: getSchemaId(),
        id,
        name: 'dummy2',
        type: VisualizationType.GEO,
      }), user2)
      const dbApp = await visualizationTable.findOne({where: {id}}, user1)
      expect(dbApp).toMatchObject({
        id,
        name: 'dummy2',
        version: 2,
      })
      const history = await visualizationHistoryTable.find({where: {id}, order: {name: 'asc'}}, user1)
      expect(history).toMatchObject([{
        id,
        name: 'dummy1',
        version: 1,
        edited_by: user1.email,
        edited_at: expect.any(Date),
      }, {
        id,
        name: 'dummy2',
        version: 2,
        edited_by: user2.email,
        edited_at: expect.any(Date),
      }])
    })
    it('cannot upsert an visualization with no schema', async () => {
      const id = getFakeId()
      await expect(visualizationRepository.upsert(
        VisualizationFactory.fromSpec({
          id,
          name: 'dummy',
          type: VisualizationType.GEO,
        }),
        user1
      )).rejects.toThrow('Cannot upsert an visualization with no schema')
    })
  })

  test('list', async () => {
    const id = getFakeId()
    await visualizationTable.insert({
      id, name: 'dummy', schema: getSchemaId(),
    }, user1)
    const apps = await visualizationRepository.list(undefined, user1)
    expect(apps.filter((visualization) => visualization.id === id).length === 1).toBeTruthy()
  })

  test('delete', async () => {
    const id = getFakeId()
    await visualizationTable.insert({id, name: 'dummy'}, user1)
    let visualization = await visualizationTable.findOne({where: {id}}, user1)
    expect(visualization).toBeTruthy()

    await visualizationRepository.delete(id, user1)
    visualization = await visualizationTable.findOne({where: {id}}, user1)
    expect(visualization).toBeFalsy()
  })

  test('listHistory', async () => {
    const id = getFakeId()
    const date1 = dayjs.utc('2021-01-01').toISOString()
    const date2 = dayjs.utc('2022-01-01').toISOString()
    await visualizationTable.insert({id, name: 'dummy'}, user1)
    await visualizationHistoryTable.insert({
      id,
      name: 'dummy',
      version: 1,
      edited_by: user1.email,
      edited_at: date1,
    }, user1)
    await visualizationHistoryTable.insert({
      id,
      name: 'dummy',
      version: 2,
      edited_by: user2.email,
      edited_at: date2,
    }, user2)
    const history = await visualizationRepository.listHistory(id, user1)
    expect(history).toMatchObject([{
      version: 2,
      editedBy: user2.email,
      editedAt: dayjs('2022-01-01').toDate(),
    }, {
      version: 1,
      editedBy: user1.email,
      editedAt: dayjs('2021-01-01').toDate(),
    }])
  })

  test('rollback', async () => {
    const id = getFakeId()
    await visualizationRepository.upsert(VisualizationFactory.fromSpec({
      id,
      name: 'spaces',
      $schema: '0.31',
      type: VisualizationType.GEO,
    }), user1)
    await visualizationRepository.upsert(VisualizationFactory.fromSpec({
      $schema: '0.32',
      id,
      name: 'geo',
      type: VisualizationType.GEO,
    }), user2)
    await visualizationRepository.rollback(id, 1, user1)
    const visualization = (await visualizationTable.findOne({where: {id}}, user1)).toDomain()
    expect(visualization).toMatchObject({
      id,
      name: 'spaces',
      $schema: getSchemaId(),
    })
    const history = await visualizationHistoryTable.find({where: {id}, order: {version: 'desc'}}, user1)
    expect(history).toMatchObject([{
      id,
      name: 'spaces',
      version: 3,
    }, {
      id,
      name: 'geo',
      version: 2,
    }, {
      id,
      name: 'spaces',
      version: 1,
    }])
  })

  test('get version', async () => {
    const id = getFakeId()
    await visualizationRepository.upsert(VisualizationFactory.fromSpec({
      $schema: getSchemaId(),
      id, name: 'spaces',
      type: VisualizationType.GEO,
    }), user1)
    await visualizationRepository.upsert(VisualizationFactory.fromSpec({
      $schema: getSchemaId(),
      id, name: 'geo',
      type: VisualizationType.GEO,
    }), user2)
    const visualization = await visualizationRepository.getVersion(id, 1, user1)
    expect(visualization?.name).toEqual('spaces')
  })
})
