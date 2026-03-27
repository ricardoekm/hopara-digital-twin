import React, {useContext} from 'react'
import {MenuItem} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {AuthRepository} from '@hopara/authorization'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {useMatch} from 'react-router-dom'
import {i18n} from '@hopara/i18n'
import {isPersonalSpace} from '@hopara/authorization/src/AuthRepository'
import { usePageNavigation } from '@hopara/page/src/PageNavigation'

interface Props {
  tenants: string[]
  email: string
}

export const TenantSelector = ({tenants, email}: Props): React.ReactElement => {
  const authContext = useContext(AuthContext)
  const urlParams = useMatch({path: '/:tenant/*'})
  const navigate = usePageNavigation()
  const sortedTenants = [...tenants].sort((t1, t2) => {
    if (isPersonalSpace(email, t1)) return 1
    if (isPersonalSpace(email, t2)) return -1
    return t1.localeCompare(t2)
  })

  return (
    <FormControl fullWidth id="spotlight-7" sx={{
      'display': 'grid',
      'gridAutoFlow': 'column',
      'gridTemplateColumns': '2.75em 1fr',
      'boxShadow': '0 2px 3px -1px rgba(0,0,0,0.275)',
      'transition': 'all 0.15s ease-out',
      'height': 40,
      'color': 'spec.onOriginal',
      '& > svg': {
        'margin': 'auto',
        'gridColumnStart': '1',
        'gridRowStart': '1',
        'scale': '0.9',
      },
      '&:hover': {
        'backgroundColor': 'rgba(0,0,0,0.1)',
        'cursor': 'pointer',
      },
      '&:active': {
        'backgroundColor': 'rgba(0,0,0,0.2)',
      },

    }}>
      <Icon icon="tenant"/>

      <Select
        sx={{
          'gridColumnStart': '1',
          'gridColumnEnd': '-1',
          'gridRowStart': '1',
          'paddingLeft': '2.25em',
          'alignSelf': 'center',
          'justifySelf': 'center',
          'background': 'none',
          'border': 'none',
          'color': 'spec.onOriginal',
          'borderRadius': 0,
          'fontSize': '15px',
          'cursor': 'default',
          'width': '100%',
          'overflow': 'hidden',
          '& > div': {
            'display': 'grid',
            'gridAutoFlow': 'column',
            'gridTemplateColumns': 'auto 1fr auto',
            'margin': '-0.5em',
          },
          '& fieldset': {
            'border': 'none',
          },
          '& svg': {
            'color': 'spec.onOriginal',
          },
        }}

        id="tenant-selector"
        value={AuthRepository.getAllowedCurrentTenant(authContext.authorization, urlParams)}
        onChange={(e) => navigate.urlNavigate(`/${e.target.value}/visualization`, {hard: true})}
      >
        {sortedTenants.map((tenant, i) => {
          let tenantName = tenant.split('.')[0]
          if (isPersonalSpace(email, tenant)) {
            tenantName = i18n('PERSONAL_SPACE')
          }
          return (
            <MenuItem key={`${tenant}-${i}`} value={tenant}>
              {tenantName}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}
