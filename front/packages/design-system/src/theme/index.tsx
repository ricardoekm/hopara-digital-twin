import {CreateMUIStyled} from '@mui/system'
import {Theme} from './Theme'
import {styled as muiStyled} from '@mui/material'
import {useTheme as useMaterialTheme} from '@mui/material'

export const styled = ((c, args) => {
  if (!c || !args?.name) {
    throw new Error('styled component requires a name. Otherwise it will be hard to debug.')
  }
  args.shouldForwardProp = (prop) => !prop.includes('_') && prop !== 'sx'
  return muiStyled(c, args)
}) as CreateMUIStyled<Theme>

export type {Theme} from './Theme'

export const useTheme = (): Theme => {
  return useMaterialTheme() as Theme
}

export function withTheme<T>(Component): React.ComponentType<Omit<T, 'theme'>> {
  return function WrappedComponent(props) {
    const theme = useTheme()
    return <Component {...props} theme={theme} />
  }
}
