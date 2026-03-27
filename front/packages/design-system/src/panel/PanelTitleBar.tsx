import React from 'react'
import {Box, Chip, SxProps, Tooltip, Typography} from '@mui/material'
import {styled} from '../theme'
import {HoparaIconKey, Icon} from '../icons/Icon'
import {HelperButton} from '../HelperButton'
import {PanelButton} from '../buttons/PanelButton'
import {PureComponent} from '../component/PureComponent'

interface Props {
  title?: string
  subtitle?: string
  // Separate props for different button behaviors
  onBackClick?: () => void
  onToggleCollapsed?: () => void
  collapsed?: boolean
  onCloseClick?: () => void
  buttons?: React.ReactNode[]
  icon?: HoparaIconKey
  helper?: string
  chipLabel?: string
  chipValue?: string
  onChipClick?: () => void
  children?: React.ReactNode
  sx?: SxProps
  borderBottom?: boolean
  closeButton?: boolean
  className?: string
}

const PanelTitleBarStyle = styled(Box, {name: 'PanelTitleBar'})(({theme}) => ({
  'position': 'relative',
  'alignItems': 'center',
  'borderBottom': '1px solid',
  'borderColor': theme.palette.spec.tableBorder,
  'display': 'grid',
  'paddingInline': '5px 5px',
  'minHeight': 39,
  'gap': 2,
  'gridTemplateAreas': '"back title"',
  'gridTemplateColumns': 'auto 1fr',
  'gridAutoFlow': 'column',
  '&.isCollapsed': {
    'borderColor': 'transparent',
  },
}))

export const TitleContainer = styled('div', {
  name: 'TitleContainer',
})(() => ({
  'gridArea': 'title',
  'display': 'flex',
  'flexDirection': 'column',
  'overflow': 'hidden',
  'textWrapMode': 'nowrap',
  'whiteSpace': 'nowrap',
  // O marginInlineStart será controlado via data attribute
  'marginInlineStart': 7,
  '&[data-collapsed="true"]': {
    marginInlineStart: 0,
  },
}))

export const TitleContainerRow = styled('div', {name: 'TitleContainerRow'})({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
})

export const PanelTitle = styled(Typography, {name: 'PanelTitle'})(
  () => ({
    'fontWeight': 600,
    'fontSize': 17,
    'textOverflow': 'ellipsis',
    'overflow': 'hidden',
    'whiteSpace': 'nowrap',
    'opacity': 1,
    'userSelect': 'auto',
    '&.hasSubtitle': {
      'fontWeight': 600,
      'fontSize': 16,
    },
    '.panel-title-bar.has-toggle:hover &': {
      opacity: 0.7,
      userSelect: 'none',
    },
    '.panel-title-bar.has-toggle:active &': {
      opacity: 0.5,
      userSelect: 'none',
    },
}),
)

const PanelSubtitle = styled(Typography, {name: 'PanelSubtitle'})({
  opacity: 0.5,
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
})

const StyledChip = styled(Chip, {name: 'PanelTitleBarChip'})({
  'cursor': 'pointer',
  'fontStyle': 'italic',
  '& .MuiChip-label': {
    'fontSize': 10,
  },
})

export class PanelTitleBar extends PureComponent<Props> {
  handleHeaderClick = (event: React.MouseEvent) => {
    if (!this.props.onToggleCollapsed) return
    if (
      event.target instanceof HTMLElement &&
      (event.target.closest('.panel-title-bar-close') || event.target.closest('.MuiPanelButton-root'))
    ) {
      return
    }
    this.props.onToggleCollapsed()
  }

  render() {
    const {buttons} = this.props
    const hasToggleClass = this.props.onToggleCollapsed ? 'has-toggle' : ''
    return (
      <PanelTitleBarStyle
        className={`panel-title-bar ${hasToggleClass} ${this.props.className || ''} ${this.props.collapsed ? 'isCollapsed' : ''}`}
        onClick={this.handleHeaderClick}
        style={{cursor: this.props.onToggleCollapsed ? 'pointer' : undefined}}
      >
        <Box gridArea="back">
          {this.props.onBackClick && !this.props.onToggleCollapsed && (
            <PanelButton onClick={this.props.onBackClick}>
              <Icon icon="arrow-left" />
            </PanelButton>
          )}
          
          {this.props.onToggleCollapsed && (
            <PanelButton
              onClick={(e) => {
                e.stopPropagation()
                this.props.onToggleCollapsed && this.props.onToggleCollapsed()
              }}
              className="panel-title-bar-toggle"
            >
              <Icon icon={this.props.collapsed ? 'chevron-expand' : 'chevron-close'} />
            </PanelButton>
          )}
        </Box>

        <TitleContainer data-collapsed={this.props.onToggleCollapsed || this.props.onBackClick ? 'true' : undefined}>
          <TitleContainerRow>
            <PanelTitle className={this.props.subtitle ? 'hasSubtitle' : ''}>
              {this.props.title}
            </PanelTitle>

            {this.props.helper && (
              <HelperButton
                description={this.props.helper}
                placement="bottom"
              />
            )}

            {this.props.chipLabel && (
              <Tooltip
                title={this.props.chipValue ?? this.props.chipLabel}
                PopperProps={{sx: {'& .MuiTooltip-tooltip': {userSelect: 'text'}}}}>
                <StyledChip
                  label={this.props.chipLabel}
                  variant='outlined'
                  color="primary"
                  size='small'
                  onClick={this.props.onChipClick}
                />
              </Tooltip>
            )}
          </TitleContainerRow>

          {this.props.subtitle && (
            <PanelSubtitle>
              {this.props.subtitle}
            </PanelSubtitle>
          )}
        </TitleContainer>

          {buttons?.map((button, index) => (
            <React.Fragment key={`button-${index}`}>
              {button}
            </React.Fragment>
          ))}
          {this.props.onCloseClick && (
            <PanelButton onClick={this.props.onCloseClick} className="panel-title-bar-close">
              <Icon icon="color-legend-close"/>
            </PanelButton>
          )}

        {this.props.children}
      </PanelTitleBarStyle>
    )
  }
}
