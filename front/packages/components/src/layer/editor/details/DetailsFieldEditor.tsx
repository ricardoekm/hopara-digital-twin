import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {i18n} from '@hopara/i18n'
import {Select, SelectOption, TextField} from '@hopara/design-system/src'
import {Panel} from '@hopara/design-system/src/panel/Panel'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {PanelCard, PanelCards} from '@hopara/design-system/src/panel/PanelCard'
import {Layer} from '../../Layer'
import {DetailsField, DetailsFieldType} from '../../../details/DetailsField'
import {ColorEncoding, ImageEncoding, TextEncoding} from '@hopara/encoding'
import {PrefixSuffixEditor} from '../text/PrefixSuffixEditor'
import ColorEditor from '../color/ColorEditor'
import {SaveDiscardEditorContainer} from '../../../visualization/SaveDiscardEditorContainer'
import {CloseEditorButtonContainer} from '../../../visualization/CloseEditorContainer'

export interface StateProps {
  detailsField?: DetailsField
  layer: Layer
  fieldOptions: SelectOption[]
}

export interface ActionProps {
  onChange: (detailsField: DetailsField) => void
  onBack: () => void
}

type Props = StateProps & ActionProps

export class DetailsFieldEditor extends PureComponent<Props> {
  render() {
    if (!this.props.detailsField) {
      return null
    }
    const fieldValue = this.props.detailsField.getType() === DetailsFieldType.IMAGE ?
                       (this.props.detailsField.value.encoding.image?.field ?? '') :
                       (this.props.detailsField.value.encoding.text?.field ?? '')
    
    const buttons = [
      <SaveDiscardEditorContainer key="save-discard" />,
      <CloseEditorButtonContainer key="close" />,
    ]

    return <Panel
      header={<PanelTitleBar
        title={this.props.detailsField?.title}
        subtitle={this.props.layer.name}
        onBackClick={this.props.onBack}
        buttons={buttons}
      />}
    >
      <PanelCards>
        <PanelCard>
          <PanelGroup>
            <PanelField
              title={i18n('FIELD')}
              layout="inline"
            >
              <TextField disabled value={fieldValue}/>
            </PanelField>


            <PanelField
              title={i18n('NAME')}
              layout="inline"
            >
              <TextField
                value={this.props.detailsField.getTitle()}
                onChange={(event) => {
                  if (this.props.detailsField) {
                    this.props.onChange(new DetailsField({...this.props.detailsField, title: event.target.value}))
                  }
                }}
                autoFocus={!this.props.detailsField.title}
              />
            </PanelField>

            <PanelField
              title={i18n('TYPE')}
              layout="inline"
            >
              <Select
                value={this.props.detailsField.getType()}
                options={[
                  {value: DetailsFieldType.TEXT, label: i18n('TEXT')},
                  {value: DetailsFieldType.IMAGE, label: i18n('IMAGE')},
                ]}
                onChange={(event) => {
                  if (event.target.value === DetailsFieldType.TEXT) {
                    this.props.onChange(new DetailsField({
                      ...this.props.detailsField,
                      value: {encoding: {text: new TextEncoding({field: fieldValue})}},
                    }))
                  } else if (event.target.value === DetailsFieldType.IMAGE) {
                    this.props.onChange(new DetailsField({
                      ...this.props.detailsField,
                      value: {encoding: {image: new ImageEncoding({field: fieldValue})}},
                    }))
                  }
                }}
              />

            </PanelField>
          </PanelGroup>
          {this.props.detailsField.getType() === DetailsFieldType.TEXT && <>
            <PrefixSuffixEditor
              type="prefix"
              encoding={this.props.detailsField.value.encoding.text}
              onChange={(textEncoding) => {
                this.props.onChange(new DetailsField({
                  ...this.props.detailsField,
                  value: {
                    encoding: {
                      text: textEncoding,
                    },
                  },
                }))
              }}
              fieldOptions={this.props.fieldOptions}
            />

            <PrefixSuffixEditor
              type="suffix"
              encoding={this.props.detailsField.value.encoding.text}
              onChange={(textEncoding) => {
                this.props.onChange(new DetailsField({
                  ...this.props.detailsField,
                  value: {
                    ...this.props.detailsField?.value,
                    encoding: {
                      ...this.props.detailsField?.value.encoding,
                      text: textEncoding,
                    },
                  },
                }))
              }}
              fieldOptions={this.props.fieldOptions}
            />
            <ColorEditor
              encoding={this.props.detailsField.value.encoding.color ?? new ColorEncoding({})}
              fieldOptions={this.props.fieldOptions}
              allowFixed={true}
              allowOpacity={false}
              allowFallback={true}
              allowColorSelection={true}
              allowSaturation={false}
              allowOverride={false}
              layerId={this.props.layer.getId()}
              onChange={(colorEncoding) => {
                this.props.onChange(new DetailsField({
                  ...this.props.detailsField,
                  value: {
                    ...this.props.detailsField?.value,
                    encoding: {
                      ...this.props.detailsField?.value.encoding,
                      color: colorEncoding,
                    },
                  },
                }))
              }}
            />
          </>}
        </PanelCard>
      </PanelCards>
    </Panel>
  }
}
