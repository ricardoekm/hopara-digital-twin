import { Layer } from '../layer/Layer'
import { LayerType } from '../layer/LayerType'
import { getImageCandidates } from './ImageCandidates'

test('Get shape candidates return image layers below the target layer', () => {
    const layers = [
        new Layer({
            id: 'layer1',
            type: LayerType.image,
            visible: {
                value: true,
                zoomRange: {
                  min: {
                    value: 0,
                  },
                  max: {
                    value: 5,
                  },
                },
              } as any,
        }),
        new Layer({
            id: 'layer2',
            type: LayerType.image,
            visible: {
                value: true,
                zoomRange: {
                  min: {
                    value: 10,
                  },
                },
              } as any,
        }),
    ]

    const candidates = getImageCandidates(layers as any, 5)
    expect(candidates.length).toBe(1)
    expect(candidates[0].getId()).toBe('layer2')
})

test('If target layer has no visibility restriction pick any one', () => {
    const layers = [
        new Layer({
            id: 'layer1',
            type: LayerType.image,
            visible: {
                value: true,
                zoomRange: {
                  min: {
                    value: 0,
                  },
                },
              } as any,
        }),
    ]

    const candidates = getImageCandidates(layers as any, undefined as any)
    expect(candidates.length).toBe(1)
    expect(candidates[0].getId()).toBe('layer1')
})

test('If index is sent filter layers below', () => {
  const layers = [
      new Layer({
          id: 'layer1',
          type: LayerType.image,
          visible: {
              value: true,
              zoomRange: {
                min: {
                  value: 0,
                },
                max: {
                  value: 5,
                },
              },
            } as any,
      }),
      new Layer({
          id: 'layer2',
          type: LayerType.image,
          visible: {
              value: true,
              zoomRange: {
                min: {
                  value: 10,
                },
              },
            } as any,
      }),
  ]

  const candidates = getImageCandidates(layers as any, 3, 1)
  expect(candidates.length).toBe(1)
  expect(candidates[0].getId()).toBe('layer1')
})
