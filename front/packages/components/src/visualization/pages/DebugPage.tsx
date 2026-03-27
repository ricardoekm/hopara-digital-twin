import React, {PureComponent} from 'react'
import {Theme} from '@hopara/design-system/src/theme/Theme'
import {Button, Card, CardActions, CardContent, IconButton, Slider, Typography} from '@mui/material'
import {i18n} from '@hopara/i18n'
import {TextField} from '@hopara/design-system/src/form/TextField'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import {withTheme} from '@hopara/design-system/src'

class DebugPage extends PureComponent<{ theme: Theme }> {
  render(): React.ReactNode {
    return (
      <div style={{margin: 20}}>
        <Typography variant="h1">{i18n('DEBUG_PAGE')}</Typography>
        <Typography variant="h2">{i18n('PALETTE')}</Typography>
        <table style={{width: '100%'}}>
          <tbody>
          <tr>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.primary,
              color: this.props.theme.palette.spec.onPrimary,
            }}>
              primary
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.onPrimary,
              color: this.props.theme.palette.spec.primary,
            }}>
              onPrimary
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.primaryContainer,
              color: this.props.theme.palette.spec.onPrimaryContainer,
            }}>
              primaryContainer
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.onPrimaryContainer,
              color: this.props.theme.palette.spec.primaryContainer,
            }}>
              onPrimaryContainer
            </td>
          </tr>
          <tr>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.secondary,
              color: this.props.theme.palette.spec.onSecondary,
            }}>
              secondary
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.onSecondary,
              color: this.props.theme.palette.spec.secondary,
            }}>
              onSecondary
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.secondaryContainer,
              color: this.props.theme.palette.spec.onSecondaryContainer,
            }}>
              secondaryContainer
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.onSecondaryContainer,
              color: this.props.theme.palette.spec.secondaryContainer,
            }}>
              onSecondaryContainer
            </td>
          </tr>
          <tr>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.tertiary,
              color: this.props.theme.palette.spec.onTertiary,
            }}>
              tertiary
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.onTertiary,
              color: this.props.theme.palette.spec.tertiary,
            }}>
              onTertiary
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.tertiaryContainer,
              color: this.props.theme.palette.spec.onTertiaryContainer,
            }}>
              tertiaryContainer
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.onTertiaryContainer,
              color: this.props.theme.palette.spec.tertiaryContainer,
            }}>
              onTertiaryContainer
            </td>
          </tr>
          <tr>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.error,
              color: this.props.theme.palette.spec.onError,
            }}>
              error
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.onError,
              color: this.props.theme.palette.spec.error,
            }}>
              onError
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.errorContainer,
              color: this.props.theme.palette.spec.onErrorContainer,
            }}>
              errorContainer
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.onErrorContainer,
              color: this.props.theme.palette.spec.errorContainer,
            }}>
              onErrorContainer
            </td>
          </tr>
          <tr>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.background,
              color: this.props.theme.palette.spec.onBackground,
            }}>
              background
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.onBackground,
              color: this.props.theme.palette.spec.background,
            }}>
              onBackground
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.surface,
              color: this.props.theme.palette.spec.onSurface,
            }}>
              surface
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.onSurface,
              color: this.props.theme.palette.spec.surface,
            }}>
              onSurface
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{
              backgroundColor: this.props.theme.palette.spec.outline,
              color: this.props.theme.palette.spec.surfaceVariant,
            }}>
              outline
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.surfaceVariant,
              color: this.props.theme.palette.spec.onSurfaceVariant,
            }}>
              surfaceVariant
            </td>
            <td style={{
              backgroundColor: this.props.theme.palette.spec.onSurfaceVariant,
              color: this.props.theme.palette.spec.surfaceVariant,
            }}>
              onSurfaceVariant
            </td>
          </tr>
          <tr>
            <td style={{
              color: this.props.theme.palette.spec.inverseSurface,
              backgroundColor: this.props.theme.palette.spec.inverseOnSurface,
            }}>
              inverseOnSurface
            </td>
            <td style={{
              color: this.props.theme.palette.spec.inverseSurface,
              backgroundColor: this.props.theme.palette.spec.inversePrimary,
            }}>
              inversePrimary
            </td>
            <td style={{
              color: this.props.theme.palette.spec.inverseOnSurface,
              backgroundColor: this.props.theme.palette.spec.inverseSurface,
            }}>
              inverseSurface
            </td>
          </tr>
          </tbody>
        </table>

        <br/>
        <Typography variant="h2">{i18n('TONAL')}</Typography>
        <table style={{width: '100%'}}>
          <tbody>
          {Object.entries(this.props.theme.palette.spec.tonal).map(([key, value]) => (
            <tr key={key}>
              {Object.entries(value).map(([toneKey, toneValue]) => (
                <td key={toneKey} style={{
                  backgroundColor: toneValue,
                  color: parseInt(toneKey) > 50 ? '#000' : '#fff',
                }}>
                  {toneKey}
                </td>
              ))}
            </tr>
          ))}
          </tbody>
        </table>

        {i18n('TEXTFIELD')}
        <br/>
        <TextField/>
        <br/>
        {i18n('BUTTON')}
        <br/>
        <Button variant={'outlined'}>{i18n('BUTTON')}</Button>
        <br/>
        <Card sx={{maxWidth: 345}}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Gabriel
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lizards are a widespread group of squamate reptiles, with over 6,000
              species, ranging across all continents except Antarctica
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton><Icon icon="check"/></IconButton>
            <Button size="small">Share</Button>
          </CardActions>
          <CardActions>
            <Slider min={0} max={100} value={50}/>
          </CardActions>
        </Card>
        <br/>
      </div>
    )
  }
}

export default withTheme(DebugPage)
