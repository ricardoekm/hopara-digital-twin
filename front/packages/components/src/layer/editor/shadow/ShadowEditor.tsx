import React from 'react'
import {i18n} from '@hopara/i18n'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {PureComponent} from '@hopara/design-system'
import {ToggleButton, ToggleButtonGroup} from '@mui/material'
import {ShadowEncoding} from '@hopara/encoding/src/shadow/ShadowEncoding'

export interface StateProps {
  layerId: string;
  encoding: ShadowEncoding;
  testId?: string;
}

export interface ActionProps {
  onChange: (encoding: ShadowEncoding) => void;
}

type Props = StateProps & ActionProps

class ShadowEditor extends PureComponent<Props> {
  render() {
    return (
      <PanelGroup
        inline
        title={i18n('SHADOW')}
        testId={this.props.testId}
        secondaryAction={
          <ToggleButtonGroup
            value={this.props.encoding.inner ? 'inner' : (this.props.encoding.outer ? 'outer' : 'none')}
            exclusive
            onChange={(event, newvalue) => {
              if (newvalue === 'inner') {
                return this.props.onChange(new ShadowEncoding({
                  ...this.props.encoding,
                  outer: false,
                  inner: true,
                }))
              } else if (newvalue === 'outer') {
                return this.props.onChange(new ShadowEncoding({
                  ...this.props.encoding,
                  outer: true,
                  inner: false,
                }))
              } else {
                return this.props.onChange(new ShadowEncoding({
                  ...this.props.encoding,
                  outer: false,
                  inner: false,
                }))
              }
            }}
          >
            <ToggleButton value="none">
              {i18n('NONE')}
            </ToggleButton>
            <ToggleButton value="inner">
              {i18n('INNER')}
            </ToggleButton>
            <ToggleButton value="outer">
              {i18n('OUTER')}
            </ToggleButton>
          </ToggleButtonGroup>
        }
      />
    )
  }
}

export default ShadowEditor
