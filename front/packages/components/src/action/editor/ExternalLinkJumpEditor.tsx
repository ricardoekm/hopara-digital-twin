import {i18n} from '@hopara/i18n'
import {Select, TextField} from '@hopara/design-system/src'
import {ExternalLinkJump} from '../Action'
import React from 'react'
import { PureComponent } from '@hopara/design-system'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import { PanelField } from '@hopara/design-system/src/panel/PanelField'

interface Props {
  action: ExternalLinkJump
  onChange: (action: ExternalLinkJump) => void
}

export class ExternalLinkJumpEditor extends PureComponent<Props> {
  render() {
    const action = this.props.action
    return <PanelGroup>
      <PanelField title={i18n('URL')} layout="inline">
        <TextField
          value={action?.href ?? ''}
          onChange={(event) => {
            this.props.onChange(new ExternalLinkJump({
              ...action,
              href: event.target.value,
            }))
          }}
        />
      </PanelField>

      <PanelField title={i18n('TARGET')} layout="inline">
        <Select
          options={[
            {label: i18n('NEW_TAB'), value: '_blank'},
            {label: i18n('SAME_TAB'), value: '_self'},
          ]}
          value={action?.target ?? '_blank'}
          onChange={(event) => {
            this.props.onChange(new ExternalLinkJump({
              ...action,
              target: event.target.value,
            }))
          }}
        />
      </PanelField>
    </PanelGroup>
  }
}
