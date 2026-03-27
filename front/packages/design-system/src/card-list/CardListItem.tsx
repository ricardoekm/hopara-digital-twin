import React from 'react'
import {
  Box,
  CardMedia,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
  Link as MuiLink,
} from '@mui/material'
import { useTheme, Theme } from '../theme'
import {Icon} from '../icons/Icon'
import { SxProps } from '@mui/system'
import {Link} from 'react-router-dom'

export interface CardButton {
  label: string
  onClick: () => void
  disabled?: boolean
  testId?: string
  color?: 'error'
}

export type CardListItemSize = 'small' | 'medium' | 'large';

const getSizes = (size: CardListItemSize) => {
  if (size === 'medium') {
    return {
      width: 140,
      aspectRatio: '175/100',
      skeletonTextWidth: 100,
    }
  }
  if (size === 'large') {
    return {
      width: 220,
      aspectRatio: '157/100',
      skeletonTextWidth: 180,
    }
  }
  return {
    width: 80,
    aspectRatio: '1/1',
    skeletonTextWidth: 80,
  }
}

interface CardProps {
  name?: string;
  backgroundImage?: string;
  chip?: string | React.ReactNode;
  icon?: React.ReactNode;
  size?: CardListItemSize;
  color?: string;
  loading?: boolean;
  testId?: string;
  buttons?: CardButton[];
  flat?: boolean;
  imageStyle?: SxProps<Theme>;
  style?: any;
  href?: string
  disabled?: boolean
  hardLink?: boolean
  onClick?: () => void
  id?: string
}

export const CardListItem = (props: CardProps) => {
  const [imageNotFound, setImageNotFound] = React.useState(false)
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const menuOpen = Boolean(anchorEl)
  const cursor = props.disabled ? 'default' : 'pointer'
  const size = props.size ?? 'large'
  const sizeProps = getSizes(size)
  let color: string
  let backgroundColor: string | undefined

  if (props.color === 'original') {
    color = theme.palette.original.contrastText
    backgroundColor = theme.palette.original.main
  } else if (props.color === 'light' || !props.color) {
    color = theme.palette.spec.tonal.neutral[30]
    backgroundColor = theme.palette.spec.tonal.neutral[90]
  } else {
    color = theme.palette.spec.onBackground
    backgroundColor = props.color
  }

  if (props.flat) {
    backgroundColor = undefined
  }

  const smallScreenStyle = (style) => ({
    [theme.breakpoints.down('sm')]: props.size !== 'small' ? style : {},
  })

  const menuClicked = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }
  const menuClosed = () => {
    setAnchorEl(null)
  }

  const handleImageError = () => {
    setImageNotFound(true)
  }

  const icon = props.icon ? props.icon : <Icon icon="placeholder" size="xl" />
  const linkComponent = props.href && props.hardLink ? MuiLink : props.href ? Link : 'div'

  const image = (
    <Box component={linkComponent}
      data-testid={props.testId}
      to={props.hardLink ? undefined : props.href}
      href={props.hardLink ? props.href : undefined}
      onClick={props.onClick}
      sx={{
        textDecoration: 'none',
        gridArea: '1 / 1 / -1 / -1',
        borderRadius: props.flat ? 0 : '4px',
        overflow: 'hidden',
        boxShadow: props.flat ? undefined : '0 2px 4px -1px rgba(0,0,0,0.45)',
        width: sizeProps.width,
        aspectRatio: sizeProps.aspectRatio,
        placeContent: 'center',
        ...smallScreenStyle({
          width: '100%',
        }),
      }}
    >
      {imageNotFound || !props.backgroundImage ? (
        <Box
          sx={{
            display: 'grid',
            placeItems: 'center',
            height: '100%',
            backgroundColor,
            color,
            ...((props.imageStyle ? props.imageStyle : {}) as any),
          }}
        >
          {icon}
        </Box>
      ) : (
        <CardMedia
          component="img"
          image={props.backgroundImage}
          alt={props.name}
          src={props.backgroundImage ?? ''}
          onError={handleImageError}
          sx={{
            width: '100%',
            height: '100%',
          }}
        />
      )}
    </Box>
  )

  const text = (
    <Box component={linkComponent}
      color="inherit"
      style={{ cursor }}
      to={props.hardLink ? undefined : props.href}
      href={props.hardLink ? props.href : undefined}
      onClick={props.onClick}
    >
      <Typography
        title={props.name}
        variant="h6"
        sx={{
          fontWeight: '500',
          fontSize: '12px',
          letterSpacing: '0.28',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          display: 'inline-block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: sizeProps.width,
          ...smallScreenStyle({
            width: 'initial',
            whiteSpace: 'nowrap',
            textOverflow: 'initial',
          }),
        }}
      >
        {props.name}
      </Typography>
    </Box>
  )

  let chipLabel

  if (props.chip) {
    chipLabel = (
      <Chip
        size="small"
        label={props.chip}
        sx={{
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.spec.backgroundCanvasButton,
          backdropFilter: theme.palette.spec.backgroundBlur,
          fontSize: '10px',
          fontWeight: '600',
          letterSpacing: 0.6,
          textTransform: 'uppercase',
          height: 20,
        }}
      />
    )
  }

  let buttons
  if (props.buttons && props.buttons.length > 0) {
    buttons = (
      <Box
        sx={{
          display: 'grid',
        }}
      >
        <IconButton
          size="small"
          data-testid="card-menu-button"
          onClick={menuClicked}
          sx={{
            'backgroundColor': 'rgba(255,255,255,0.66)',
            'backdropFilter': theme.palette.spec.backgroundBlur,
            'color': 'black',
            'scale': '0.9',
            'boxShadow': '0 2px 4px -1px rgba(0,0,0,0.24)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.9)',
              backdropFilter: theme.palette.spec.backgroundBlur,
            },
            '&:active': {
              scale: '0.85',
            },
          }}
        >
          <Icon icon="more-horiz" />
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={menuClosed}
        >
          {props.buttons.map((button, index) => (
            <MenuItem
              key={index}
              disabled={button.disabled}
              data-testid={button.testId}
              onClick={() => {
                menuClosed()
                button.onClick()
              }}
              sx={{
                color: button.color === 'error' ? theme.palette.spec.error : 'inherit',
              }}
            >
              {button.label}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    )
  }

  const card = (
    <Box
      id={props.id}
      data-test-id={props.testId}
      sx={{
        cursor,
        'color': theme.palette.text.primary,
        'display': 'flex',
        'flexDirection': 'column',
        'placeItems': 'center',
        'gap': '0.66em',
        'textAlign': 'center',
        'listStyle': 'none',
        'padding': props.flat ? 4 : undefined,
        'width': 'max-content',
        '&:hover': {
          ...(!props.disabled && !props.flat
            ? {
                opacity: 0.75,
              }
            : {}),
          ...(props.flat
            ? {
                'color': theme.palette.text.primary,
                'backgroundColor': theme.palette.spec.backgroundCanvasButton,
                'borderRadius': '4px',
                '&:active': {
                  backgroundColor: 'rgba(0,0,0,.1)',
                },
              }
            : {}),
        },
        '&:active': !props.disabled
          ? {
              opacity: 0.5,
            }
          : {},
        ...smallScreenStyle({
          width: '100%',
          placeItems: 'unset',
          margin: '0 auto',
        }),
        ...props.style,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {image}
        <Box
          sx={{
            gridArea: '1 / -1 / 1 / -1',
            display: 'flex',
            gap: '0.15em',
            placeItems: 'center',
            placeSelf: 'end',
            padding: 2,
          }}
        >
          {chipLabel}
          {buttons}
        </Box>
      </Box>
      {text}
    </Box>
  )

  const skeleton = (
    <Box
      sx={{
        width: sizeProps.width,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25em',
        ...props.style,
        ...smallScreenStyle({ width: '100%' }),
      }}
    >
      <Skeleton
        height="initial"
        variant="rounded"
        sx={{
          width: sizeProps.width,
          aspectRatio: sizeProps.aspectRatio,
          ...smallScreenStyle({ width: '100%' }),
        }}
      />
      <Skeleton width={sizeProps.skeletonTextWidth} />
    </Box>
  )

  return props.loading ? skeleton : card
}
