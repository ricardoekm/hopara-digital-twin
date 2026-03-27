import React from 'react'
import { PureComponent } from '@hopara/design-system'
import { i18n } from '@hopara/i18n'
import { PanelCard } from '@hopara/design-system/src/panel/PanelCard'
import { PanelGroup } from '@hopara/design-system/src/panel/PanelGroup'
import { PanelField } from '@hopara/design-system/src/panel/PanelField'
import { SelectOption } from '@hopara/design-system/src/form'
import { Select } from '@hopara/design-system/src/form/Select'
import { Columns } from '@hopara/dataset'
import FieldEditor from '../../../layer/editor/field/FieldEditor'

interface StateProps {
  layerOptions: SelectOption[]
  selectedLayerId?: string
  conditionFieldOptions: SelectOption[]
  selectedConditionField?: string
  selectedLayerColumns?: Columns
}

interface ActionProps {
  onLayerChange: (layerId: string) => void
  onConditionChange: (field: string) => void
}

type Props = StateProps & ActionProps

export class AutoNavigationEditor extends PureComponent<Props> {
  render() {
    return (
      <PanelCard title={i18n('AUTO_NAVIGATION')}>
        <PanelGroup>
          <PanelField
            title={i18n('LAYER')}
            layout="inline"
          >
            <Select
              options={this.props.layerOptions}
              value={this.props.selectedLayerId ?? ''}
              onChange={(e) => this.props.onLayerChange(e.target.value)}
            />
          </PanelField>
          {this.props.selectedLayerId && (
            <FieldEditor
              title={i18n('CONDITION')}
              layout="inline"
              options={this.props.conditionFieldOptions}
              columns={this.props.selectedLayerColumns}
              field={this.props.selectedConditionField}
              onChange={(value) => this.props.onConditionChange(value)}
              includeNullOption={true}
              nullOptionLabel={i18n('NONE_FEMALE')}
            />
          )}
        </PanelGroup>
      </PanelCard>
    )
  }
}

