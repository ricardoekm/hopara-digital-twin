import React from 'react'
import {PureComponent} from '../component/PureComponent'
import {Title} from '../Title'
import {Icon} from '../icons/Icon'
import {i18n} from '@hopara/i18n'
import {Box, Typography} from '@mui/material'
import SimpleButton from '../buttons/SimpleButton'

type ErrorProps = {
  message?: string
}

export class ErrorBanner extends PureComponent<ErrorProps> {
  render() {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        textAlign: 'center',
        color: (theme) => theme.palette.primary.main,
        backgroundColor: (theme) => theme.palette.background.default,
        width: '100%',
        height: '100%',
      }}>
        <Icon icon="error" size="xxl" />
        <Title>{i18n('SOMETHING_WENT_WRONG')}</Title>
        <Typography sx={{fontSize: 15}}>{this.props.message}</Typography>
        <SimpleButton onClick={() => window.location.reload()}>{i18n('REFRESH_PAGE')}</SimpleButton>
      </Box>
    )
  }
}
