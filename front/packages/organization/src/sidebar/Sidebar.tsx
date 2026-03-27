import React, { useContext } from 'react'
import { MenuItem } from '@mui/material'
import { styled, useTheme } from '@hopara/design-system/src'
import MenuList from '@mui/material/MenuList'
import { Link } from 'react-router-dom'
import { i18n } from '@hopara/i18n'
import { AuthContext } from '@hopara/auth-front/src/contexts/AuthContext'
import { TenantSelector } from './TenantSelector'
import { MainMenu } from './MainMenu'
import { Icon } from '@hopara/design-system/src/icons/Icon'
import { TintImage } from '@hopara/design-system/src/TintImage'
import { PageType } from '@hopara/page/src/Pages'
import { usePageNavigation } from '@hopara/page/src/PageNavigation'
import { Config } from '@hopara/config'

const MainSidebarContainer = styled('div', { name: 'MainSidebarContainer' })(
  ({ theme }) => ({
    background: theme.palette.original.main,
    gridArea: 'sidebar',
    position: 'fixed',
    width: '320px',
    height: '100dvh',
    overflowY: 'auto',
    overflowX: 'hidden',
    [theme.breakpoints.down('sm')]: {
      height: 'auto',
      position: 'fixed',
      top: 0,
      width: '100%',
    },
  }),
)

const MainSidebarInner = styled('div', { name: 'VisualizationsHeadingHeadingInner' })(
  ({ theme }) => ({
    display: 'grid',
    gridTemplateAreas: '"tenants" "logo" "menu" "account"',
    gridTemplateRows: 'auto 8em min-content 1fr',
    height: '100%',

    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  }),
)

const MainSidebarTitle = styled('h1', { name: 'MainSidebarTitle' })(
  ({ theme }) => ({
    color: theme.palette.original.contrastText,
    alignItems: 'center',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    span: {
      fontSize: 24,
      fontWeight: 500,
    },
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  }),
)

export const Sidebar = () => {
  const authContext = useContext(AuthContext)
  const pageNavigation = usePageNavigation(authContext.authorization.tenant)
  const theme = useTheme()

  const logoImage =
    theme?.components.HoparaBranding.logoSmallUrl ??
    theme?.components.HoparaBranding.logoUrl
  const tenants = authContext.authorization.tenants ?? []

  return (
    <MainSidebarContainer id="mainSidebar">
      <MainSidebarInner>
        {<TenantSelector tenants={tenants} email={authContext.authorization.email} />}

        <MainSidebarTitle id="logo">
          <Link
            to={pageNavigation.getUrl(PageType.ListVisualizations)}
            style={{
              color: 'currentColor',
            }}
          >
            {logoImage && <TintImage src={logoImage} size={96} height={48} />}
          </Link>
        </MainSidebarTitle>

        <MainMenu />

        <MenuList
          sx={{
            'color': theme?.palette.original.contrastText,
            'alignSelf': 'end',
            'marginBottom': '1em',
            '& > li': {
              display: 'grid',
              gridTemplateColumns: '40px 1fr',
            },
            '& > li > svg': {
              alignSelf: 'center',
            },

            [theme.breakpoints.down('sm')]: {
              display: 'none',
            },
          }}
        >
          {Config.getValueAsBoolean('AUTH_ENABLED') && (
            <MenuItem>
              <Icon icon="account" />
              <Link
                to="/auth/profile"
                style={{
                  color: theme?.palette.original.contrastText,
                  textDecoration: 'none',
                }}
              >
                {authContext.authorization.email}
              </Link>
            </MenuItem>
          )}

          <MenuItem>
            <Icon icon="document" />
            <Link
              to="https://docs.hopara.app"
              target="_blank"
              style={{
                color: theme?.palette.original.contrastText,
                textDecoration: 'none',
              }}
            >
              {i18n('DOCUMENTATION')}
            </Link>
          </MenuItem>

          <MenuItem>
            <Icon icon="help" />
            <Link
              to="mailto:support@hopara.io"
              target="_blank"
              style={{
                color: theme?.palette.original.contrastText,
                textDecoration: 'none',
              }}
            >
              {i18n('HELP_AND_SUPPORT')}
            </Link>
          </MenuItem>

          <MenuItem
            onClick={() => authContext.signOut()}
          >
            <Icon icon="logout" />
            <span
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'flex',
                placeItems: 'center',
                gap: '0.33em',
              }}
            >
              {i18n('SIGN_OUT')}
            </span>
          </MenuItem>
        </MenuList>
      </MainSidebarInner>
    </MainSidebarContainer>
  )
}
