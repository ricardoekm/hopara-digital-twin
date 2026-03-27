import React from 'react'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {i18n} from '@hopara/i18n'
import { TextField } from '@hopara/design-system/src/form'
import {PureComponent} from '@hopara/design-system'

export interface StateProps {
  layerId: string
  value?: string
}

export interface ActionProps {
  onChange: (value: string) => void
}

type Props = StateProps & ActionProps

export class NameEditor extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
  }
  render(): React.ReactNode {
    return <PanelGroup title={i18n('NAME')} inline>
      <TextField
        name={`layer-title`}
        value={this.props.value}
        inputProps={{'aria-label': i18n('NAME')}}
        onChange={(e) => this.props.onChange(e.target.value)}
        fullWidth
      debounce={500}
      />
    </PanelGroup>
  }
}


