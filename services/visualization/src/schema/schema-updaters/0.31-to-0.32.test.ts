import {SchemaMigration031to032} from './0.31-to-0.32.js'

test('rename app to visualization', () => {
  const migration = new SchemaMigration031to032()
  const migratedApp = migration.migrate({
    $schema: 'https://schema.hopara.app/app/0.31',
    layers: [{
      type: 'circle',
      actions: [{
        type: 'VISUALIZATION_JUMP',
        app: 'any-viz-1',
      }, {
        type: 'VISUALIZATION_JUMP',
        app: 'any-viz-2',
        visualization: 'any-viz-2',
      }, {
        type: 'NOT_VIZ_JUMP',
        do: true,
        not: true,
        touch: true,
      }],
    }],
  })

  expect(migratedApp).toEqual({
    $schema: 'https://schema.hopara.app/app/0.32',
    layers: [{
      type: 'circle',
      actions: [{
        type: 'VISUALIZATION_JUMP',
        visualization: 'any-viz-1',
      }, {
        type: 'VISUALIZATION_JUMP',
        visualization: 'any-viz-2',
      }, {
        type: 'NOT_VIZ_JUMP',
        do: true,
        not: true,
        touch: true,
      }],
    }],
  })
})
