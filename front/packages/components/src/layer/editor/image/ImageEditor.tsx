import {Select, SelectOption, TextField} from '@hopara/design-system/src/form'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {ImageEncoding, ImageResolution} from '@hopara/encoding'
import {i18n} from '@hopara/i18n'
import Case from 'case'
import React from 'react'
import { PureComponent } from '@hopara/design-system'
import FieldEditor from '../field/FieldEditor'
import { Columns } from '@hopara/dataset'

export interface StateProps {
  encoding?: ImageEncoding;
  fieldOptions: SelectOption[]
  layerId: string
  layerQueryColumns?: Columns
}

export interface ActionProps {
  onChange: (encoding: ImageEncoding) => void
}

type Props = StateProps & ActionProps
const DYNAMIC_RESOLUTION = 'automatic'

const FixedComponent = (props: Props): React.ReactElement => {
  return <>
    <PanelField
      layout="inline"
    >
      <TextField
        onChange={(event) => props.onChange(new ImageEncoding({
          ...props.encoding,
          value: event.target.value,
        }))}
        value={props.encoding?.value}
      />
    </PanelField>
  </>
}

export class ImageEditor extends PureComponent<Props> {
  getResolutionOptions(): SelectOption[] {
    return [
      { value: DYNAMIC_RESOLUTION, label: i18n('DYNAMIC') },
      { value: ImageResolution.xs, label: 'Small' },
      { value: ImageResolution.md, label: 'Medium' },
      { value: ImageResolution.xl, label: 'Large' },
    ]
  }

  getDisplayedResolution() {
    const resolution = this.props.encoding?.resolution

    if (resolution === ImageResolution.sm) return ImageResolution.xs
    if (resolution === ImageResolution.lg) return ImageResolution.xl
    if (resolution === ImageResolution.tb) return ImageResolution.xs

    return resolution ?? DYNAMIC_RESOLUTION
  }

  handleFieldChange(field: any) {
    this.props.onChange(new ImageEncoding({
      ...this.props.encoding,
      field,
      value: field ? undefined : '',
    }))
  }

  handleResolutionChange(event: { target: { value: ImageResolution | string } }) {
    const resolution = event.target.value === DYNAMIC_RESOLUTION ? undefined : event.target.value as ImageResolution
    this.props.onChange(new ImageEncoding({
      ...this.props.encoding,
      resolution,
    }))
  }

  render() {
    return (
      <PanelGroup
        title={i18n('IMAGE_KEY')}
        inline
        helperText={i18n('IMAGE_KEY_HELPER')}
        secondaryAction={
          <FieldEditor
            options={this.props.fieldOptions}
            field={this.props.encoding?.field}
            columns={this.props.layerQueryColumns}
            includeNullOption={true}
            nullOptionLabel={Case.sentence(i18n('FIXED_FEMALE'))}
            onChange={this.handleFieldChange.bind(this)}
            testId="select-image"
          />
        }
      >
        {!this.props.encoding?.field && <FixedComponent {...this.props} />}

        <PanelField
          layout="inline"
          title={i18n('RESOLUTION')}
        >
          <Select
            value={this.getDisplayedResolution()}
            options={this.getResolutionOptions()}
            onChange={this.handleResolutionChange.bind(this)}
            testId="select-image-resolution"
          />
        </PanelField>
      </PanelGroup>)
  }
}
