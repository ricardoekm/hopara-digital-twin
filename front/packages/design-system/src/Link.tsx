import React from 'react'
import MuiLink from '@mui/material/Link'
import { SxProps } from '@mui/material'
import {labelToTestId} from './test/TestTools'
import { styled } from './theme'

const LinkStyle = styled(MuiLink, { name: 'Link' })(({ theme }) => {
  return {
    'cursor': 'pointer',
    'textDecoration': 'none',
    'display': 'inline-flex',
    'alignItems': 'center',
    'gap': '4px',
    'verticalAlign': 'middle',

    '&.spotlightLink': {
      'cursor': 'default',
      'textUnderlineOffset': 4,
      'backgroundColor': theme.palette.spec.spotlightLinkBackground,
      'color': theme.palette.spec.spotlightLinkForeground,
      'padding': '3px 10px 3px 6px',
      'borderRadius': '50px',
    },
    '&.spotlightLink:before': {
      'content': `url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11,4.25 C14.7275095,4.25 17.75,7.27249046 17.75,11 C17.75,12.593595 17.1975623,14.0583296 16.2737758,15.213115 L18.9053301,17.8446699 C19.1982233,18.1375631 19.1982233,18.6124369 18.9053301,18.9053301 C18.6124369,19.1982233 18.1375631,19.1982233 17.8446699,18.9053301 L15.213115,16.2737758 C14.0583296,17.1975623 12.593595,17.75 11,17.75 C7.27249046,17.75 4.25,14.7275095 4.25,11 C4.25,7.27249046 7.27249046,4.25 11,4.25 Z M11,5.75 C8.10091759,5.75 5.75,8.10091759 5.75,11 C5.75,13.8990824 8.10091759,16.25 11,16.25 C13.8990824,16.25 16.25,13.8990824 16.25,11 C16.25,8.10091759 13.8990824,5.75 11,5.75 Z' fill='${encodeURIComponent(theme.palette.spec.spotlightLinkForeground)}' opacity='0.5' fill-rule='nonzero'%3E%3C/path%3E%3C/svg%3E")`,
      'display': 'inline-block',
      'width': '18px',
      'height': '18px',
      'verticalAlign': 'middle',
    }
  }
})

export const Link: React.FunctionComponent<{
  children: string | React.ReactNode
  onClick?: () => void
  onMouseEnter?: (rect: DOMRect) => void
  onMouseLeave?: () => void
  sx?: SxProps
  spotlightLink?: boolean
  href?: string
  target?: string
}> = ({children, onClick, onMouseEnter, onMouseLeave, sx, spotlightLink, href, target}) => {
  const testId = typeof children === 'string' ? `${labelToTestId(children)}-link` : ''
  const ref = React.useRef<HTMLAnchorElement>(null)

  return (
    <LinkStyle
      ref={ref}
      className={spotlightLink ? 'spotlightLink' : ''}
      underline={spotlightLink ? 'always' : 'hover'}
      onClick={onClick}
      onMouseEnter={() => onMouseEnter?.(ref.current!.getBoundingClientRect())}
      onMouseLeave={onMouseLeave}
      data-testid={testId}
      sx={sx}
      aria-label="change link"
      role='button'
      href={href}
      target={target}>
      {children}
    </LinkStyle>
  )
}
