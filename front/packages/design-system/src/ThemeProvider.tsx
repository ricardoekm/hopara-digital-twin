import React from 'react'
import {Config} from '@hopara/config'
import {createThemeFromTenant, CssBaseline, Theme, ThemeProvider as DesignSystemThemeProvider, userPrefersDarkMode} from './theme/Theme'
import { PureComponent } from './component/PureComponent'

const DEFAULT_STYLE_INTERFACE = Config.getValue('STYLE_INTERFACE').toLowerCase()

export type ThemeProps = {
  authorization?: { tenant: string }
  themeConfig?: { mode: string }
  styleInterface?: any
  children?: React.ReactNode;
}

type ThemeState = {
  selectedTheme?: string
  themeMode?: string
  theme: Theme
}

export class ThemeProvider extends PureComponent<ThemeProps, ThemeState> {
  interfaceName: string

  constructor(props) {
    super(props)

    this.state = {
      selectedTheme: undefined,
      themeMode: undefined,
      theme: createThemeFromTenant('hopara', this.getThemeMode()),
    }
    this.interfaceName = DEFAULT_STYLE_INTERFACE
  }

  getThemeMode(themeConfig?: { mode: string }) {
    if (themeConfig?.mode) {
      return themeConfig.mode
    }

    return userPrefersDarkMode() ? 'dark' : 'light'
  }

  componentDidUpdate() {
    const noAuthorization = !this.props.authorization?.tenant && this.state.selectedTheme
    if (noAuthorization) {
      return this.setState({
        selectedTheme: undefined,
        themeMode: undefined,
        theme: createThemeFromTenant('hopara', this.getThemeMode(this.props.themeConfig)),
      })
    }

    const tenantWasChanged = this.props.authorization?.tenant && this.state.selectedTheme !== this.props.authorization.tenant
    const themeModeWasChanged = this.props.themeConfig?.mode && this.state.themeMode !== this.props.themeConfig.mode
    if (this.props.authorization && (tenantWasChanged || themeModeWasChanged)) {
      this.setState({
        selectedTheme: this.props.authorization.tenant,
        themeMode: this.props.themeConfig?.mode,
        theme: createThemeFromTenant(this.props.authorization.tenant, this.getThemeMode(this.props.themeConfig)),
      })
    }
  }

  render() {
    return (
      <DesignSystemThemeProvider theme={this.state.theme}>
        <CssBaseline/>
        {this.props.children}
      </DesignSystemThemeProvider>
    )
  }
}


