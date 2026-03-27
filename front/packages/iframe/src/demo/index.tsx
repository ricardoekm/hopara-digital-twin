import React from 'react'
import {createRoot} from 'react-dom/client'
import { DemoPage } from './Demo'

createRoot(
  document.getElementById('root') as Element)
  .render(<DemoPage />)
