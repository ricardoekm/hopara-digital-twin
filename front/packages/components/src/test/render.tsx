 
import {render as testingLibraryRender} from '@testing-library/react'
import {provideTheme} from '@hopara/design-system/src/provide-theme'

export const render = (child) => testingLibraryRender(provideTheme(child))
