import React, { useContext } from 'react'
import { MenuItem } from '@mui/material'
import { useTheme } from '@hopara/design-system/src'
import MenuList from '@mui/material/MenuList'
import { Link, useMatch } from 'react-router-dom'
import { i18n } from '@hopara/i18n'
import { AuthContext } from '@hopara/auth-front/src/contexts/AuthContext'
import { PageType } from '@hopara/page/src/Pages'
import {usePageNavigation} from '@hopara/page/src/PageNavigation'
import {Icon} from '@hopara/design-system/src/icons/Icon'

const MainMenuItem = ({
  icon,
  label,
  selected,
  href,
  id,
}: {
  icon: any;
  label: string;
  selected: boolean;
  href: string;
  id?: string;
}) => {
  return (
    <MenuItem
      id={id}
      component={Link}
      to={href}
      sx={{
        'backgroundColor': selected ? 'rgba(0,0,0,0.2)' : 'none',
        'borderRadius': 3,
        'height': '50px',
        'margin': '0 1.25em',
        'padding': 0,
        'fontSize': '1.1em',
        'fontWeight': '500',
        'display': 'grid',
        'gridTemplateColumns': '75px max-content',
        '&:hover': {
          backgroundColor: 'rgba(0,0,0,0.15)',
        },
        '&:active': {
          backgroundColor: 'rgba(0,0,0,0.20)',
        },
        '& svg': {
          placeSelf: 'center',
          scale: '0.9',
        },
      }}
    >
      {icon}
      {selected ? <b>{label}</b> : label}
    </MenuItem>
  )
}

export const MainMenu = () => {
  const theme = useTheme()
  const authContext = useContext(AuthContext)
  const pageNavigation = usePageNavigation()

  const urlParams = useMatch({ path: '/:tenant/:menuOption/*' })

  const visualizationsSelected = urlParams?.params.menuOption === 'visualization'
  const dataSourcesSelected = urlParams?.params.menuOption === 'data-source'
  const resourcesSelected = urlParams?.params.menuOption === 'icon-library'

  return (
    <MenuList
      sx={{
        color: theme?.palette.original.contrastText,
        display: 'grid',
        gap: '0.4em',

        [theme.breakpoints.down('sm')]: {
          display: 'none',
        },
      }}
    >
      <MainMenuItem
        label={i18n('VISUALIZATIONS')}
        icon={<Icon icon="visualizations" size="xl" />}
        selected={visualizationsSelected}
        href={pageNavigation.getUrl(PageType.ListVisualizations, {tenant: authContext.authorization.tenant})}
      />

      {authContext.authorization.canListDataSources() &&
        <MainMenuItem
          id="spotlight-2"
          label={i18n('DATA')}
          icon={<Icon icon="data-source" size="xl" />}
          selected={dataSourcesSelected}
          href={pageNavigation.getUrl(PageType.ListDataSources, {tenant: authContext.authorization.tenant})}
        />
      }

      <MainMenuItem
        label={i18n('ICONS')}
        icon={<Icon icon="resource" size="xl" />}
        selected={resourcesSelected}
        href={pageNavigation.getUrl(PageType.ListIconLibraries, {tenant: authContext.authorization.tenant})}
      />
    </MenuList>
  )
}
