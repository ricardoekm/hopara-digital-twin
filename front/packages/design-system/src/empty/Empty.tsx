import React from 'react'
import {Link} from '@mui/material'
import {Theme, withTheme} from '../theme'
import {HoparaIconKey, Icon} from '../icons/Icon'
import {i18n} from '@hopara/i18n'
import {Info} from './Info'
import {PureComponent} from '../component/PureComponent'

interface Props {
  description: React.ReactNode
  documentationURL?: string
  theme: Theme
  icon?: HoparaIconKey
  noBorder?: boolean
}

class EmptyClass extends PureComponent <Props> {
  render() {
    return (
      <Info
        noBorder={this.props.noBorder}
        description={<>
          {this.props.description}
          {' '}
          {this.props.documentationURL && <Link href={this.props.documentationURL} target="_blank" sx={{textWrap: 'nowrap'}}>
            {i18n('LEARN_MORE')}
          </Link>}
        </>}
        icon={<Icon
          icon={this.props.icon ?? 'helper'}
          color={this.props.theme.palette.spec.primary}
        />}
      />
    )
  }
}

export const Empty = withTheme<Props>(EmptyClass)
