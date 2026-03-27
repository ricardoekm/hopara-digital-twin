import React from 'react'
import { i18n } from '@hopara/i18n'
import { Checkbox, FormControlLabel, FormGroup, Link } from '@mui/material'

export const TermsAndPrivacy = (props: { checked, checkboxChanged}) => {
  return (
    <FormGroup
    sx={{
      textAlign: 'left',
      justifySelf: 'start',
    }}
    >
      <FormControlLabel
        control={<Checkbox checked={props.checked} onChange={props.checkboxChanged} />}
        label={
          <span>
            {i18n('I_ACCEPT_THE')}{' '}
            <Link
              href={'https://hopara.io/terms-conditions/'}
              target={'_blank'}
              rel={'noreferrer'}
              underline="hover">
              {i18n('PRODUCT_TERMS')}
            </Link>
            {' '}{i18n('AND')}{' '}
            <Link
              href={'https://hopara.io/hopara-privacy-statement/'}
              target={'_blank'}
              rel={'noreferrer'}
              underline="hover">
              {i18n('PRIVACY_STATEMENT')}
            </Link>
          </span>
        }
      />
    </FormGroup>
  )
}  
