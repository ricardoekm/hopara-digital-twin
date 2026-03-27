import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {i18n} from '@hopara/i18n'
import {Select, SelectOption, TextField} from '@hopara/design-system/src'
import FieldEditor from '../../layer/editor/field/FieldEditor'
import {Visible} from '../../layer/Visible'
import {Action, ActionType, ExternalLinkJump, FunctionCallback, Trigger, VisualizationJump, ZoomJump} from '../Action'
import {Layer} from '../../layer/Layer'
import {IconSelect} from '../../resource/IconSelect'
import Visualization from '../../visualization/Visualization'
import {VisualizationJumpEditor} from './VisualizationJumpEditor'
import {ExternalLinkJumpEditor} from './ExternalLinkJumpEditor'
import {FunctionCallbackEditor} from './FunctionCallbackEditor'
import {ZoomJumpEditor} from './ZoomJumpEditor'
import {FitToScreenEditor} from './FitToScreenEditor'
import {Panel} from '@hopara/design-system/src/panel/Panel'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {PanelCard, PanelCards} from '@hopara/design-system/src/panel/PanelCard'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {PanelField} from '@hopara/design-system/src/panel/PanelField'
import {Columns} from '@hopara/dataset'
import {isNil} from 'lodash/fp'
import {SaveDiscardEditorContainer} from '../../visualization/SaveDiscardEditorContainer'
import {CloseEditorButtonContainer} from '../../visualization/CloseEditorContainer'
import {Box, Switch} from '@mui/material'

export interface StateProps {
  action?: Action
  fieldOptions?: SelectOption[]
  layer?: Layer
  showIconField: boolean
  visualizations: Visualization[]
  maxZoom: number
  minZoom: number
  zoom: number
  filterOptions: SelectOption[]
  filterStatus: 'loading' | 'idle' | 'error'
  showFilter: boolean
  visualizationQueryColumns?: Columns
  layerQueryColumns?: Columns
}

export interface ActionProps {
  onChange: (action: Action) => void
  onBack: () => void
  onVisualizationChanged: (visualization: string) => void
}

type Props = StateProps & ActionProps

function getCustomActionType(action?: Action) {
  if (action?.type === ActionType.ZOOM_JUMP && isNil(action.zoom?.value)) {
    return 'FIT_TO_SCREEN'
  }
  return action?.type
}

export class ActionEditor extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)
    this.state = {
      actionType: getCustomActionType(props.action),
    }
  }

  render() {
    const action = this.props.action
    if (!action) return null
    const visualizations = this.props.visualizations

    const buttons = [
      <SaveDiscardEditorContainer key="save-discard"/>,
      <CloseEditorButtonContainer key="close"/>,
    ]

    return <Panel
      header={<PanelTitleBar
        title={this.props.action?.title ?? i18n('NEW_ACTION')}
        subtitle={this.props.layer?.name}
        onBackClick={this.props.onBack}
        buttons={buttons}
      />}
    >
      <PanelCards>
        <PanelCard>
          <PanelGroup>
            <PanelField
              layout="inline"
              title={i18n('NAME')}
            >
              <TextField
                value={action.title ?? ''}
                onChange={(event) => {
                  this.props.onChange({...action, title: event.target.value})
                }}
                autoFocus={!action.title}
              />
            </PanelField>

            {this.props.showIconField && <PanelField
              title={i18n('ICON')}
              layout="inline"
            >
              <IconSelect
                value={action.icon}
                onChange={(icon) => {
                  this.props.onChange({...action, icon})
                }}
              />
            </PanelField>}

            <PanelField title="Type" layout="inline">
              <Select
                options={[
                  {label: i18n('ZOOM'), value: ActionType.ZOOM_JUMP},
                  {label: i18n('FIT_TO_SCREEN'), value: 'FIT_TO_SCREEN'},
                  {label: i18n('JUMP_TO_VISUALIZATION'), value: ActionType.VISUALIZATION_JUMP},
                  {label: i18n('EXTERNAL_LINK'), value: ActionType.EXTERNAL_LINK_JUMP},
                  {label: i18n('CALLBACK_FUNCTION'), value: ActionType.FUNCTION_CALLBACK},
                ].sort((a, b) => a.label.localeCompare(b.label))}
                value={getCustomActionType(action)}
                onChange={(event) => {
                  (action as any).link = undefined;
                  (action as any).navigate = undefined
                  if (event.target.value === ActionType.VISUALIZATION_JUMP) {
                    this.props.onChange(new VisualizationJump({...action} as VisualizationJump))
                  } else if (event.target.value === ActionType.EXTERNAL_LINK_JUMP) {
                    this.props.onChange(new ExternalLinkJump({...action} as ExternalLinkJump))
                  } else if (event.target.value === ActionType.FUNCTION_CALLBACK) {
                    this.props.onChange(new FunctionCallback({...action} as FunctionCallback))
                  } else if (event.target.value === ActionType.ZOOM_JUMP) {
                    this.props.onChange(new ZoomJump({
                      ...action,
                      zoom: {
                        value: this.props.zoom,
                      },
                    } as ZoomJump))
                  } else if (event.target.value === 'FIT_TO_SCREEN') {
                    const newAction = new ZoomJump({...action} as ZoomJump)
                    delete newAction.zoom?.value
                    this.props.onChange(newAction)
                  } else {
                    this.props.onChange(action)
                  }
                }}
              />
            </PanelField>

            <PanelField>

            </PanelField>

          </PanelGroup>

          {action.type === ActionType.VISUALIZATION_JUMP && <VisualizationJumpEditor
            {...this.props}
            action={action as any as VisualizationJump}
            visualizationOptions={visualizations.map((app) => ({
              label: app.name, value: app.id,
            }))}
            fieldOptions={this.props.fieldOptions ?? []}
            filterOptions={this.props.filterOptions}
            filterStatus={this.props.filterStatus}
            visualizationChanged={(visualization) => {
              this.props.onVisualizationChanged(visualization)
            }}
            showFilter={this.props.showFilter}
            visualizationQueryColumns={this.props.visualizationQueryColumns}
          />}
          {action.type === ActionType.EXTERNAL_LINK_JUMP && <ExternalLinkJumpEditor
            {...this.props}
            action={action as any as ExternalLinkJump}
          />}
          {action.type === ActionType.FUNCTION_CALLBACK && <FunctionCallbackEditor
            {...this.props}
            action={action as any as FunctionCallback}
          />}
          {getCustomActionType(action) === ActionType.ZOOM_JUMP && <ZoomJumpEditor
            {...this.props}
            action={action as any as ZoomJump}
          />}
          {getCustomActionType(action) === 'FIT_TO_SCREEN' && <FitToScreenEditor
            {...this.props}
            action={action as any as ZoomJump}
          />}
          <PanelGroup>
            {<FieldEditor
              layout='inline'
              options={this.props.fieldOptions ?? []}
              onChange={(field) => {
                if (field) {
                  action.visible = new Visible({condition: {test: {field}}})
                } else {
                  action.visible = undefined
                }
                this.props.onChange(action)
              }}
              field={action.visible?.condition?.test.field}
              columns={this.props.layerQueryColumns}
              title={i18n('VISIBILITY')}
              includeNullOption
              nullOptionLabel={i18n('ALWAYS_VISIBLE')}
            />}

            <PanelField
              layout="toggle"
              title={i18n('AUTO_TRIGGER')}
              helperText={i18n('AUTO_TRIGGER_HELPER')}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'right',
                }}
              >
                <Switch
                  checked={this.props.action?.trigger === Trigger.OBJECT_CLICK}
                  onChange={(event) => {
                    this.props.onChange({
                      ...action,
                      trigger: event.target.checked ? Trigger.OBJECT_CLICK : Trigger.NONE,
                    })
                  }}
                />
              </Box>
            </PanelField>

          </PanelGroup>
        </PanelCard>
      </PanelCards>
    </Panel>
  }
}

