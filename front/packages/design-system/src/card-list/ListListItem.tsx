import React from 'react'
import {Theme, withTheme} from '../theme'
import {MenuItemOrDivider, MoreButton} from '../buttons/MoreButton'
import {Box, Chip, ListItem, ListItemButton, ListItemIcon, ListItemText, Skeleton, Typography} from '@mui/material'
import {PureComponent} from '../component/PureComponent'
import {Link} from 'react-router-dom'

interface Props {
  name?: string
  chip?: string | React.ReactNode
  icon?: React.ReactNode
  loading?: boolean
  testId?: string
  menuItems?: MenuItemOrDivider[]
  href?: string
  theme: Theme
}

class ListListItemClass extends PureComponent <Props> {
  render() {
    const image = <Box data-testid={this.props.testId}>{this.props.icon}</Box>

    const text = <Box
      color='inherit'
      sx={{
        'display': 'grid',
        'alignItems': 'center',
        'textDecoration': 'none',
      }}
    >
      <Typography
        title={this.props.name}
        variant='h6'
        sx={{
          fontWeight: '500',
          fontSize: '12px',
          letterSpacing: '0.28',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          display: 'inline-block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
        {this.props.name}
      </Typography>
    </Box>

    let chipLabel

    if (this.props.chip) {
      chipLabel = <Chip
        size="small"
        label={this.props.chip}
        sx={{
          textTransform: 'lowercase',
        }}
      />
    }

    let buttons
    if (this.props.menuItems && this.props.menuItems.length > 0) {
      buttons = <MoreButton menuItems={this.props.menuItems}/>
    }

    const card = (
      <ListItem
        component={this.props.href ? Link : Box}
        disablePadding
        secondaryAction={buttons}
        to={this.props.href ?? '#'}
        sx={{
          'borderBottom': `1px solid ${this.props.theme.palette.spec.borderColor}`,
          'boxSizing': 'border-box',
          'color': this.props.theme.palette.text.primary,
        }}
      >
        {this.props.href && <ListItemButton
          data-test-id={this.props.testId}
        >
          <ListItemIcon>{image}</ListItemIcon>
          <ListItemText>{text}{chipLabel}</ListItemText>
        </ListItemButton>}
        {!this.props.href && <Box sx={{
          padding: '8px 48px 8px 16px',
          display: 'flex',
        }}>
          <ListItemIcon>{image}</ListItemIcon>
          <ListItemText>{text}{chipLabel}</ListItemText>
        </Box>}
      </ListItem>
    )

    const skeleton = <ListItem>
      <Skeleton
        height="24px"
        width="100%"
        variant="rounded"
        sx={{marginBlock: '0.2em'}}
      />
    </ListItem>

    return this.props.loading ? skeleton : card
  }
}

export const ListListItem = withTheme<Props>(ListListItemClass)
