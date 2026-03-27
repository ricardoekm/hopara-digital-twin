import { getCurrentAppVersion } from './schema-repository.js'
import {getSpecVersion, SchemaMigration} from './schema-updater.js'

describe('getSpecVersion', () => {
  it('should get spec version', () => {
    expect(getSpecVersion({})).toEqual(getCurrentAppVersion())
    expect(getSpecVersion({$schema: 'https://app.hopara.app/app'})).toEqual(getCurrentAppVersion())
    expect(getSpecVersion({$schema: 'https://schema.hopara.app/app/0.1'})).toEqual('0.1')
    expect(getSpecVersion({$schema: 'https://schema.hopara.app/app/0.2'})).toEqual('0.2')
  })
})

describe('SchemaMigration', () => {
  it('should return current app version', () => {
    process.env.SCHEMA_URL = 'https://schema.test.hopara.app/app'
    expect(SchemaMigration.migrate({})).toEqual({
      $schema: `https://schema.test.hopara.app/app/${getCurrentAppVersion()}`,
    })
  })
})

