import React from 'react'
import {i18n} from '@hopara/i18n'
import {styled} from '../theme'
import MaterialLink from '@mui/material/Link'
import {Link} from '../Link'

interface Props {
  symbol?: React.ReactNode
  title?: React.ReactNode
  content?: React.ReactNode
  onSubmit?: () => void
  onSymbolClick?: () => void
}

const Wrapper = styled('div', {name: 'BaseWrapper'})(`
  display: grid;
  grid-template-rows: 1fr auto;
  align-items: start;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 0 2em;
  grid-area: hopara;
  position: relative;
`)

const Content = styled('div', {name: 'BaseContent'})({
  textAlign: 'center',
  display: 'grid',
  justifyItems: 'center',
  gap: '2em',
  boxSizing: 'border-box',
  gridTemplateRows: '4em',
  paddingTop: '13vh',
})

const Form = styled('form', {name: 'BaseForm'})({
  'display': 'flex',
  'flexDirection': 'column',
  'alignItems': 'center',
  'width': '100%',
  'maxWidth': '38ch',

  '& > *': {
    marginBottom: '1em !important',
  },

  '& > *:last-child': {
    marginBottom: '0px !important',
  },
  '& > div > button, & > div > span > button': {
    marginTop: '1.25em',
  },
})

const Footer = styled('footer', {name: 'BaseFooter'})({
  'textAlign': 'center',
  'margin': 'auto',
  'paddingBlock': '3em',
  'whiteSpace': 'pre-wrap',
  'width': 'fit-content',
  'display': 'grid',
  'gridAutoFlow': 'column',
  'gap': '2em',
  'justifyItems': 'center',
  'alignItems': 'center',
  'lineHeight': '1.75em',
})

const SymbolWrapper = styled('span', {name: 'SymbolWrapper'})(({theme}) => ({
  'color': theme.palette.primary.main,
  'transition': 'transform 400ms cubic-bezier(.32,2,.55,.27); filter 400ms cubic-bezier(.32,2,.55,.27);',

  '.route-transition-enter &': { opacity: 0, transform: 'scale(0.75)', transition: 'none' },
  '.route-transition-enter-active &': { opacity: 1, transform: 'scale(1.0)', transition: 'transform 400ms cubic-bezier(.32,2,.55,.27); filter 400ms cubic-bezier(.32,2,.55,.27);'},

  '.route-transition-exit &': { opacity: 1, transform: 'scale(1.0)', transition: 'none' },
  '.route-transition-exit-active &': { opacity: 0, transform: 'scale(0.75)', transition: 'transform 400ms cubic-bezier(.32,2,.55,.27); filter 400ms cubic-bezier(.32,2,.55,.27);' },

  '&:hover': {
    'filter': 'none',
    'transform': 'none',
    '&.withLink': {
      filter: 'brightness(110%)',
      transform: 'scale(1.025)',
    },
  },
  '&:active': {
    'filter': 'none',
    'transform': 'none',
    '&.withLink': {
      filter: 'brightness(100%)',
      transform: 'scale(0.975)',
    },
  },
}))

const TitleWrapper = styled('span', {name: 'TitleWrapper'})({

  '.route-transition-enter &': { opacity: 0, transform: 'translateX(33%)'},
  '.route-transition-enter-active &': { opacity: 1, transform: 'translateX(0)', transition: 'all 315ms ease;' },

  '.route-transition-exit &': { opacity: 1, transform: 'translateX(0)'},
  '.route-transition-exit-active &': { opacity: 0, transform: 'translateX(-33%)', transition: 'all 315ms ease;' },

  '.route-transition-enter-reverse &': { opacity: 0, transform: 'translateX(-33%)'},
  '.route-transition-enter-active-reverse &': { opacity: 1, transform: 'translateX(0)', transition: 'all 315ms ease' },

  '.route-transition-exit-reverse &': { opacity: 1, transform: 'translateX(0)'},
  '.route-transition-exit-active-reverse &': { opacity: 0, transform: 'translateX(33%)', transition: 'all 315ms ease' },
})

const ContentWrapper = styled('div', {name: 'ContentWrapper'})({
  'display': 'grid',
  'justifyItems': 'center',
  'width': '100%',

  '& > *': { marginBottom: '1em !important' },
  '& > *:last-child': { marginBottom: '0px !important' },

  '.route-transition-enter &': { opacity: 0, transform: 'translateX(5%)'},
  '.route-transition-enter-active &': { opacity: 1, transform: 'translateX(0)', transition: 'all 250ms ease;' },

  '.route-transition-exit &': { opacity: 1, transform: 'translateX(0)'},
  '.route-transition-exit-active &': { opacity: 0, transform: 'translateX(-5%)', transition: 'all 250ms ease;' },

  '.route-transition-enter-reverse &': { opacity: 0, transform: 'translateX(-5%)'},
  '.route-transition-enter-active-reverse &': { opacity: 1, transform: 'translateX(0)', transition: 'all 250ms ease' },

  '.route-transition-exit-reverse &': { opacity: 1, transform: 'translateX(0)'},
  '.route-transition-exit-active-reverse &': { opacity: 0, transform: 'translateX(5%)', transition: 'all 250ms ease' },
})

export const SimpleLayout: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <Wrapper>
      <Content>
        {props.symbol && !props.onSymbolClick && <SymbolWrapper>{props.symbol}</SymbolWrapper>}
        {props.symbol && props.onSymbolClick && <SymbolWrapper className="withLink"><Link onClick={props.onSymbolClick}>{props.symbol}</Link></SymbolWrapper>}
        {props.title && <TitleWrapper>{props.title}</TitleWrapper>}
        <ContentWrapper>
          {!props.onSubmit && props.content}
          {props.onSubmit &&
              <Form
                  sx={{
                    'fontSize': '16px',
                    'lineHeight': '24px',
                  }}
                  onSubmit={(event) => {
                    event.preventDefault()
                    if (props.onSubmit) props.onSubmit()
                  }}>
                {props.content}
              </Form>
          }
        </ContentWrapper>
      </Content>

      <Footer>
        <div>
          <span>{i18n('COPYRIGHT')}</span><br/>
          <span><MaterialLink href={'https://hopara.io/product-terms/'} target={'_blank'} rel={'noreferrer'}
                              underline="hover"> {i18n('PRODUCT_TERMS')}</MaterialLink>.</span>
          <span><MaterialLink href={'https://hopara.io/privacy-statement/'} target={'_blank'} rel={'noreferrer'}
                              underline="hover"> {i18n('PRIVACY_STATEMENT')}</MaterialLink>.</span>
        </div>
      </Footer>
    </Wrapper>
  )
}
