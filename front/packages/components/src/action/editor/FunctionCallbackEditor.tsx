import {i18n} from '@hopara/i18n'
import {TextField} from '@hopara/design-system/src'
import {FunctionCallback} from '../Action'
import React from 'react'
import { PureComponent } from '@hopara/design-system'
import { PanelGroup } from '@hopara/design-system/src/panel/PanelGroup'
import { PanelField } from '@hopara/design-system/src/panel/PanelField'

interface Props {
  action: FunctionCallback
  onChange: (action: FunctionCallback) => void
}

export class FunctionCallbackEditor extends PureComponent<Props> {
  render() {
    const action = this.props.action
    return <PanelGroup>
      <PanelField title={i18n('NAME')} layout="inline">
        <TextField
          value={action?.name ?? ''}
          onChange={(event) => {
            this.props.onChange(new FunctionCallback({
              ...action,
              name: event.target.value,
            }))
          }}
        />
      </PanelField>
    </PanelGroup>
  }
}
