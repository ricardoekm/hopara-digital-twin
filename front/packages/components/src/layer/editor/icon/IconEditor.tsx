import {SelectOption} from '@hopara/design-system/src/form'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {IconEncoding} from '@hopara/encoding'
import {i18n} from '@hopara/i18n'
import Case from 'case'
import React from 'react'
import {PureComponent} from '@hopara/design-system'
import FieldEditor from '../field/FieldEditor'
import {IconSelect} from '../../../resource/IconSelect'
import {Box, Switch, Tooltip} from '@mui/material'
import {isNil} from 'lodash/fp'
import {MoreButton} from '@hopara/design-system/src/buttons/MoreButton'
import {Icon} from '@hopara/design-system/src/icons/Icon'
import { Columns } from '@hopara/dataset'
import {Config} from '@hopara/config'
import {HoparaCloudBadge} from '@hopara/design-system/src/branding/HoparaCloudBadge'

const cloudFeaturesEnabled = Config.getValueAsBoolean('CLOUD_FEATURES_ENABLED')

export interface StateProps {
  encoding?: IconEncoding;
  fieldOptions: SelectOption[]
  layerId: string
  tenant: string
  layerQueryColumns?: Columns
}

export interface ActionProps {
  onChange: (encoding: IconEncoding) => void
  onPreview: (encoding: IconEncoding | undefined) => void
  onGoToCreateIcon: () => void
}

type Props = StateProps & ActionProps

const FixedComponent = (props: Props & { default: boolean }): React.ReactElement => {
  return (<>
      <PanelField
        layout="inline"
        title={props.default ? i18n('FALLBACK') : undefined}
        helperText={props.default ? i18n('FALLBACK_ICON_HELPER') : undefined}
      >
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 40px',
          gap: 6,
        }}>
          <IconSelect
            onChange={(value) => {
              props.onChange(new IconEncoding({
                ...props.encoding,
                value,
              }))
            }}
            onPreview={(value) => {
              props.onPreview(value ? new IconEncoding({
                ...props.encoding,
                value,
              }) : undefined)
            }}
            value={props.encoding?.value}
          />
          <MoreButton
            menuItems={[
              {
                label: i18n('NEW_ICON'),
                icon: <Icon icon="open-in-new"/>,
                onClick: () => {
                  props.onGoToCreateIcon()
                },
              },
            ]}
          />
        </Box>
      </PanelField>
    </>
  )
}

export class IconEditor extends PureComponent<Props> {
  handleFieldChange(field: any) {
    this.props.onChange(new IconEncoding({
      ...this.props.encoding,
      field,
      smartSearch: !!field && isNil(this.props.encoding?.smartSearch) ? true : this.props.encoding?.smartSearch,
    }))
  }

  handleSmartSearchChange(event: any) {
    this.props.onChange(new IconEncoding({
      ...this.props.encoding,
      smartSearch: event.target.checked,
    }))
  }

  render() {
    return (
      <PanelGroup
        title={i18n('ICON')}
        inline
        secondaryAction={
          <FieldEditor
            options={this.props.fieldOptions}
            field={this.props.encoding?.field}
            columns={this.props.layerQueryColumns}
            includeNullOption={true}
            nullOptionLabel={Case.sentence(i18n('FIXED'))}
            onChange={this.handleFieldChange.bind(this)}
          />
        }
      >
        {this.props.encoding?.field &&
          <PanelField layout="inline"
                           helperText={cloudFeaturesEnabled
                             ? i18n('SMART_SEARCH_HELPER')
                             : <span>{i18n('SMART_SEARCH_HELPER')}. <HoparaCloudBadge withPeriod /></span>}
                           title={i18n('SMART_SEARCH')}>
            <Tooltip title={!cloudFeaturesEnabled ? <HoparaCloudBadge /> : ''} placement="bottom">
              <span style={{display: 'inline-flex', width: 'fit-content'}}>
                <Switch
                  size="small"
                  disabled={!cloudFeaturesEnabled}
                  onChange={this.handleSmartSearchChange.bind(this)}
                  checked={cloudFeaturesEnabled && !!this.props.encoding.smartSearch}/>
              </span>
            </Tooltip>
          </PanelField>
        }
        {<FixedComponent {...this.props} default={!!this.props.encoding?.field}/>}
      </PanelGroup>)
  }
}
