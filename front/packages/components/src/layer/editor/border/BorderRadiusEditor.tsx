import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {i18n} from '@hopara/i18n'
import {SizeEncoding} from '@hopara/encoding'
import {LayerEditorOwnProps} from '../LayerEditor'
import {Slider} from '@hopara/design-system/src'
import ViewState from '../../../view-state/ViewState'

export interface StateProps {
  layerId: string
  encoding?: SizeEncoding
  viewState?: ViewState
}

export interface ActionProps {
  onChange: (borderRadius?: number) => void
}

type Props = StateProps & ActionProps & LayerEditorOwnProps

export class BorderRadiusEditor extends PureComponent<Props> {
  getRadius() {
    const projectedValue = this.props.viewState?.projectCommonsToPixel(this.props.encoding?.getRenderValue() ?? 0, this.props.viewState?.zoom)
    return Math.round(projectedValue ?? 0)
  }

  render() {
    return <PanelGroup
      title={i18n('BORDER_RADIUS')}
      inline
      secondaryAction={<>
        <Slider
          min={0}
          max={50}
          step={1}
          value={this.getRadius()}
          valueLabelDisplay="auto"
          onChange={(event: any) => {
            this.props.onChange(
              parseInt(event.target.value),
            )
          }}
        />
      </>}
    />
  }
}
