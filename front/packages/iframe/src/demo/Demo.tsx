import React from 'react'
import Hopara from '../client'
import buildingsData from './resources/buildings-data.json'
import sensorsData from './resources/sensors-data.json'
import assetsData from './resources/assets-data.json'
import { PureComponent } from '@hopara/design-system'

export class DemoPage extends PureComponent<any> {
  componentDidMount(): void {
    const hopara = Hopara.init({
      debug: true,
      visualizationId: '',
      fallbackVisualizationId: '',
      tenant: '',
      accessToken: '',
      // refreshToken: '',
      targetElementId: 'embedded-target-element',
      darkMode: true,
      // filters: [{
      //   field: 'type',
      //   values: ['REFRIGERATOR', 'FREEZER'],
      // }],
      // initialRow: {
      //   layerId: 'hopara-floors',
      //   rowId: '1',
      // },
      embeddedUrl: 'http://localhost:3000/',
      dataLoaders: [
        // ...ibbxMockLoaders,
        {
          query: 'labs_floorplans',
          source: 'sample',
          loader: async () => {
            return buildingsData
          },
        } as any,
        {
          query: 'sensors',
          source: 'sample',
          loader: async () => {
            return sensorsData
          },
        } as any,
        {
          query: 'labs_assets',
          source: 'sample',
          loader: async () => {
            return assetsData
          },
        } as any,
      ],
      callbacks: [
        {
          name: 'CALLBACK_TEST',
          callback: (data) => {
            alert(`CALLBACK_TEST 4: ${data._id}`)
          },
        },
        {
          name: 'goTo3D',
          callback: () => {
            hopara?.update({
              visualizationId: '78-ativo-3d-2',
              fallbackVisualizationId: 'ativo-3d-2',
            })
          },
        },
        {
          name: 'goTo2D',
          callback: () => {
            hopara?.update({
              visualizationId: '78-ativo-2d-2',
              fallbackVisualizationId: 'ativo-2d-2',
            })
          },
        },
      ],
    })

    // setInterval(() => {
      // hopara?.update({
      //   visualizationId: '78-ativo-3d-2',
      //   fallbackVisualizationId: 'ativo-3d-2',
      // })
    // }, 10000)
  }

  render() {
    return (
      <div style={{
        display: 'grid',
        gridTemplateRows: '70px 1fr',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}>
        <h1 style={{
          alignItems: 'center',
          background: '#efefef',
          display: 'flex',
          font: '22px sans-serif',
          justifyContent: 'center',
          margin: 0,
          padding: '0.5em',
          textAlign: 'center',
        }}>
          Hopara embedded demo page!
        </h1>
        <div
          id="embedded-target-element"
          style={{
            width: '100%',
            height: '100%',
            background: '#fefefe',
          }}></div>
      </div>
      )
    }
  }
