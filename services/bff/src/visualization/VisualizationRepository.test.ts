import { Repository as VisualizationRepository } from './VisualizationRepository'
import fs from 'fs'
import { Visualization } from './Visualization'
import { Authorization } from '../authorization'

class VisualizationRepositoryStub implements VisualizationRepository {
  async list() {
    return []
  }

  async getSchema(): Promise<any> {
    return {}
  }

  async get(visualizationId: string): Promise<any> {
    try {
      const data = await fs.promises.readFile(__dirname + `/test-resources/${visualizationId}.json`)
      const visualizationString = JSON.parse(data.toString())
      return new Visualization(visualizationString)
    } catch {
      return null
    }
  }

  async getAll(tenant: string): Promise<any> {
    try {
      const data = await fs.promises.readFile(__dirname + `/test-resources/${tenant}-apps.json`)
      return JSON.parse(data.toString())
    } catch {
      return []
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(templateId: string, visualizationId: string, appName: string, authorization: Authorization): Promise<void> {
    return new Promise((resolve) => resolve())
  }

  async getHistory(): Promise<any[]> {
    return []
  }
}

export const getVisualizationRepositoryStub = (): VisualizationRepository => new VisualizationRepositoryStub()

it('should get a visualization', async () => {
  const repository = getVisualizationRepositoryStub()
  const visualization = await repository.get('any-visualization-id', 1, { tenant: 'tenant', token: 'token' }) as any
  expect(visualization.id).toEqual('any-visualization-id')
  expect(visualization.name).toEqual('Any Visualization Name')
})
