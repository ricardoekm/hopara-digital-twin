import React, {PropsWithChildren} from 'react'
import {Box} from '@mui/material'
import {PureComponent} from './component/PureComponent'
import {styled} from './theme'

export const VISUALIZATION_PANEL_ID = '__hopara_visualization_panel__'

interface VisualizationLayoutProps extends PropsWithChildren {
  _fullScreen: boolean
  _panelColumnSize?: 'large' | 'small' | 'collapsed'
}

export const VisualizationLayoutStyle = styled(Box, {name: 'VisualizationLayout'})<VisualizationLayoutProps>((props) => {
  const panelColumnSize =
    props._panelColumnSize === 'large' ? '414px'
    : props._panelColumnSize === 'small' ? '356px'
    : props._panelColumnSize === 'collapsed' ? '260px'
    : 'auto'
  return `
    display: grid;
    height: 100vh;
    height: 100dvh;
    width: 100vw;
    grid-template-areas:
      "left panel legend-chart top right"
      "left panel legend legend legend";
    grid-template-columns: auto ${panelColumnSize} auto 1fr auto;
    grid-template-rows: auto 1fr;
    placeItems: start;
    ${props.theme.breakpoints.down('sm')} {
      grid-template-areas:
        "left top right"
        "left legend-chart right"
        "legend legend legend"
        "panel panel panel"
        "sidebar sidebar sidebar";
      grid-template-columns: auto 1fr auto;
      grid-template-rows: auto 1fr auto auto auto;
    }
   `
})

export class VisualizationLayout extends PureComponent<VisualizationLayoutProps> {
  divRef = React.createRef<HTMLDivElement>()

  componentDidUpdate(prevProps: VisualizationLayoutProps) {
    if (this.props._fullScreen && !prevProps._fullScreen) {
      this.goFullScreen()
    }
  }

  async goFullScreen() {
    if (this.divRef.current) {
      if (this.divRef.current.requestFullscreen) {
        await this.divRef.current.requestFullscreen()
      }
    }
  }

  render() {
    return <VisualizationLayoutStyle
      id="visualization-layout"
      ref={this.divRef}
      {...this.props}
    >
      {this.props.children}
    </VisualizationLayoutStyle>
  }
}

export const SidebarWrapper = styled(Box, {name: 'SidebarWrapper'})(({theme}) => ({
  'gridArea': 'sidebar',
  'overflow': 'auto',
  'position': 'relative',
  'zIndex': 1,
  '&>div': {
    backgroundColor: theme.palette.background.default,
    borderInlineEnd: `1px solid ${theme.palette.spec.borderColor}`,
    height: 'auto',
  },
  [theme.breakpoints.down('sm')]: {
    borderInlineEnd: 'none',
    overflowX: 'auto',
    overflowY: 'hidden',
  },
}))

interface PanelWrapperProps {
  children: React.ReactNode
  opaqueBackground?: boolean
}

export const PanelWrapperStyle = styled(Box, {name: 'PanelWrapper'})((props) => {
  const {theme} = props
  return {
    'gridArea': 'panel',
    'display': 'grid',
    'gridTemplateRows': '1fr',
    'backgroundColor': theme.palette.spec.backgroundPanel,
    '&.opaqueBackground': {
      'backgroundColor': theme.palette.background.default,
    },
    'backdropFilter': theme.palette.spec.backgroundBlur,
    'marginBlock': '6px 10px',
    'marginInline': 4,
    'height': 'fit-content',
    'borderRadius': 10,
    'maxHeight': 'calc(100vh - 16px)',
    'boxShadow': 'rgba(0, 0, 0, 0.1) 0px 2px 5px -1px',
    'border': '1px solid rgba(0,0,0,0.1)',
    'zIndex': 2,
    'overflow': 'hidden',
    '@supports (height: 100dvh)': {
      maxHeight: 'calc(100dvh - 16px)',
    },
    [theme.breakpoints.down('sm')]: {
      border: 'none',
      borderRadius: 0,
      boxShadow: 'none',
      borderTop: `1px solid ${theme.palette.spec.borderColor}`,
      height: 'auto',
      maxHeight: '45vh',
      width: '100%',
      margin: 0,
      zIndex: 8,
    },
  }
})

export const PanelWrapper = (props: PanelWrapperProps) => {
  const {children, opaqueBackground} = props
  return <PanelWrapperStyle className={opaqueBackground ? 'opaqueBackground' : ''} id={VISUALIZATION_PANEL_ID}>
    {children}
  </PanelWrapperStyle>
}

const PanelContentStyle = styled(Box, {name: 'PanelContent'})({
  transition: 'transform 0.42s ease-in-out',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
})

export const PanelContent = (props) => {
  return <PanelContentStyle className="panel-content" {...props} />
}
