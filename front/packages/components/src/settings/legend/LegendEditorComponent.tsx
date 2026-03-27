import React, {Suspense} from 'react'
import {PureComponent} from '@hopara/design-system'
import {i18n} from '@hopara/i18n'
import {LegendEditorList} from './LegendEditorList'
import {Layers} from '../../layer/Layers'
import {Empty} from '@hopara/design-system/src/empty/Empty'
import {Legends} from '../../legend/Legends'
import LegendCodeEditorContainer from './code/LegendCodeEditorPanelContainer'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {MoreButton} from '@hopara/design-system/src/buttons/MoreButton'
import {SubPanel, SubPanelWrapper} from '@hopara/design-system/src/panel/SubPanel'

export interface StateProps {
  layers: Layers;
  customizedLegendLayers: Layers;
  legends: Legends;
  isAdvancedMode: boolean;
}

export interface ActionProps {
  onAdvancedModeClick(enabled: boolean): void;

  onChange(legends: Legends): void;
}

type Props = StateProps & ActionProps

export class LegendEditorComponent extends PureComponent<Props> {
  render() {
    if (this.props.isAdvancedMode) {
      return <Suspense fallback={null}>
        <LegendCodeEditorContainer/>
      </Suspense>
    }

    return <SubPanelWrapper>
      <SubPanel
        header={<PanelTitleBar
          title={i18n('COLOR_LEGENDS')}
          helper={!!this.props.layers.length || !!this.props.legends.length ? i18n('EMPTY_COLOR_LEGENDS') : undefined}
          buttons={[<MoreButton
            menuItems={[{label: i18n('ADVANCED_MODE'), onClick: () => this.props.onAdvancedModeClick(true)}]}
            key="more"/>]}
        />}
      >
        {(!this.props.layers.length && !this.props.legends.length) ?
          (<Empty noBorder description={i18n('EMPTY_COLOR_LEGENDS')}/>) :
          (<LegendEditorList
            layers={this.props.layers}
            legends={this.props.legends}
            customizedLegendLayers={this.props.customizedLegendLayers}
            onChange={this.props.onChange}
          />)}
      </SubPanel>
    </SubPanelWrapper>
  }
}
