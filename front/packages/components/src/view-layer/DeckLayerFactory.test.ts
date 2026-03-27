import {Layers} from '../layer/Layers'
import {getAnyLayer} from '../layer/Layer.test'
import {Authorization} from '@hopara/authorization'
import {createFromLayer} from './DeckLayerFactory'
import {Rowsets} from '../rowset/Rowsets'
import {getAnyRowset} from '../rowset/Rowset.test'
import {CircleLayer} from './deck/factory/CircleFactory/CircleLayer'
import IconManager from './deck/factory/IconFactory/IconManager'

test('Get deck layer returns correct type', () => {
  const circleLayer = getAnyLayer()

  const layer = createFromLayer({
    rowsets: new Rowsets(getAnyRowset()),
    zoom: 0,
    layers: new Layers(),
    resource: {
      authorization: new Authorization({} as any),
      maxTextureSize: 4096,
    } as any,
    callbacks: {} as any,
    lockedRowsetIds: [],
    isOnObjectEditor: false,
    isOnLayerEditor: false,
    isOnSettingsEditor: false,
    editAccentColor: 'red',
    iconManager: new IconManager(4096),
  }, circleLayer)
  expect(layer[0] instanceof CircleLayer).toBeTruthy()
})

test('Get deck layer fills layer props', () => {
  const layer = getAnyLayer({visible: false})

  const deckLayer = createFromLayer({
    rowsets: new Rowsets(getAnyRowset()),
    zoom: 0,
    layers: new Layers(),
    resource: {
      authorization: new Authorization({} as any),
      maxTextureSize: 4096,
    } as any,
    callbacks: {} as any,
    lockedRowsetIds: [],
    isOnObjectEditor: false,
    isOnLayerEditor: false,
    isOnSettingsEditor: false,
    editAccentColor: 'red',
    iconManager: new IconManager(4096),
  }, layer) as any
  expect(deckLayer.visible).toBeFalsy()
})
