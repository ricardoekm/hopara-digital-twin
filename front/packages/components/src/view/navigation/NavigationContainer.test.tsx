import React from 'react'
import {act} from '@testing-library/react'
import {render} from '../../test/render'
import {NavigationContainer} from './NavigationContainer'
import HoparaProvider from '../../hoc/Provider'
import { MemoryRouter } from 'react-router-dom'
import { provideTheme } from '@hopara/design-system/src/provide-theme'

const mockNavigate = {
  urlNavigate: jest.fn(),
  getUrl: jest.fn(),
}

jest.mock('@hopara/page/src/PageNavigation', () => ({
  usePageNavigation: () => mockNavigate,
}))

const getRenderer = () => {
  return render(provideTheme(
    <MemoryRouter>
      <HoparaProvider>
        <NavigationContainer/>
      </HoparaProvider>
    </MemoryRouter>,
  ))
}

it('test', async () => {
  await act(async () => {
    getRenderer()
  })
  expect(true).toBeTruthy()
})
