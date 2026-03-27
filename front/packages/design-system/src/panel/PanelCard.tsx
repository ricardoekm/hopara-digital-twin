import {Accordion, AccordionDetails, AccordionSummary, Box, SxProps, Theme as MuiTheme} from '@mui/material'
import React from 'react'
import {styled, Theme, withTheme} from '../theme'
import {PureComponent} from '../component/PureComponent'
import {HelperButton} from '../HelperButton'
import {Icon} from '../icons/Icon'

interface Props {
  title?: string
  expandable?: boolean;
  children: React.ReactNode;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onChangeExpanded?: (expanded: boolean) => void;
  helperText?: string
  disablePadding?: boolean
  testId?: string
  sx?: SxProps<MuiTheme>
  theme: Theme
}

const PanelCardStyle = styled(Box, {name: 'PanelCard'})(({theme}: {theme: any}) => ({
  'display': 'flex',
  'flexDirection': 'column',
  'gap': 12,
  'padding': 12,
  'borderBottom': `1px solid ${theme.palette.spec.borderColor}`,
  '&:last-of-type': {
    [theme.breakpoints.up('sm')]: {
      borderBottom: 'none',
    },
  },
}))

export const PanelCardTitle = styled(Box, {name: 'PanelCardTitle'})({
  'fontSize': 12,
  'fontWeight': 600,
  'lineHeight': 1.25,
  'letterSpacing': '1px',
  'textTransform': 'uppercase',
  'display': 'flex',
  'gap': 4,
  'alignItems': 'center',
})

const PanelCardChildren = styled(Box, {name: 'PanelCardChildren'})({
})

class PanelCardComp extends PureComponent<Props> {
  render() {
    if (!this.props.expandable) {
      return <PanelCardStyle theme={this.props.theme} sx={this.props.sx}>
        {this.props.title && <PanelCardTitle>
          {this.props.title}
          {this.props.helperText && <HelperButton description={this.props.helperText}/>}
        </PanelCardTitle>}
        <PanelCardChildren>
          {this.props.children}
        </PanelCardChildren>
      </PanelCardStyle>
    }

    return <Accordion
      data-testid={`accordion-${this.props.title?.toLowerCase()}`}
      expanded={this.props.expanded}
      defaultExpanded={this.props.defaultExpanded}
      onChange={(_, expanded) => {
        if (this.props.onChangeExpanded) {
          this.props.onChangeExpanded(expanded)
        }
      }}
      sx={{
        'borderBottom': `1px solid ${this.props.theme.palette.spec.borderColor}`,
        'borderRadius': 0,
        'background': this.props.theme.palette.background.default,
        '&.Mui-expanded': {
          margin: 0,
        },
        'padding': this.props.disablePadding ? '0' : '0 12px 0 12px',
        'boxShadow': 'none',
        '&:before': {
          display: 'none',
        },
        ':last-of-type': {
          borderRadius: 0,
          [this.props.theme.breakpoints.up('sm')]: {
            borderBottom: 'none',
          },
        },
        ...this.props.sx,
      }}
    >
      <AccordionSummary
        expandIcon={<Icon icon="expand-more"/>}
        sx={{
          'background': this.props.theme.palette.background.default,
          'padding': this.props.disablePadding ? '0 12px 0 12px' : 0,
          'minHeight': 0,
          'alignItems': 'center',
          'gap': 4,
          'flexDirection': 'row-reverse',
          '& .MuiAccordionSummary-expandIconWrapper': {
            transform: 'rotate(-90deg)',
          },
          '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(0deg)',
          },
          '& .MuiAccordionSummary-content.Mui-expanded': {
            margin: '12px 0',
          },
          '& .MuiAccordionSummary-content': {
            gap: 4,
          },
          '&.Mui-expanded': {
            minHeight: 'auto',
            margin: 0,
          },
        }}
      >
        <PanelCardTitle>{this.props.title}</PanelCardTitle>
        {this.props.helperText && <HelperButton description={this.props.helperText} />}
      </AccordionSummary>
      <AccordionDetails sx={{
        paddingBottom: '12px',
        paddingLeft: this.props.disablePadding ? 0 : 2,
        paddingRight: this.props.disablePadding ? 0 : 2,
        background: this.props.theme.palette.background.default,
      }}>
        <PanelCardChildren>
          {this.props.children}
        </PanelCardChildren>
      </AccordionDetails>
    </Accordion>
  }
}

export const PanelCards = styled(Box, {name: 'PanelCards'})({
  'display': 'flex',
  'flexDirection': 'column',
  'flex': 1,
  'overflowY': 'auto',
  'overflowX': 'hidden',
})

export const PanelCard = withTheme<Props>(PanelCardComp)
