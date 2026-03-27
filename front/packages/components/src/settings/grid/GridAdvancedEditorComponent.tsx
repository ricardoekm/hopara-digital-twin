import React from 'react'
import { PureComponent } from '@hopara/design-system'
import Ajv from 'ajv'
import {i18n} from '@hopara/i18n'
import Visualization from '../../visualization/Visualization'
import { Panel } from '@hopara/design-system/src/panel/Panel'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {JsonEditor} from '@hopara/design-system/src/code-editor/JsonEditor'

export interface StateProps {
  obj: any;
  schema: any;
}

export interface ActionProps {
  onChange: (visualization: Partial<Visualization>) => void;
  onBackClick: () => void;
}

type Props = StateProps & ActionProps

const ajv = new Ajv({ discriminator: true })

export class GridAdvancedEditorComponent extends PureComponent<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  codeChanged(newCode: string) {
    let parsedObj: any
    try {
      parsedObj = JSON.parse(newCode)
    } catch {
      this.setState({hasError: true})
      return
    }
    const valid = ajv.validate(this.props.schema, parsedObj)

    if (valid) {
      this.props.onChange(parsedObj)
      this.setState({hasError: false})
    } else {
      this.setState({hasError: true})
    }
  }

  render() {
    const json = JSON.stringify(this.props.obj, null, 2)

    return (
      <Panel
        header={<PanelTitleBar
          title={i18n('GRID')}
          onBackClick={this.props.onBackClick}
        />}
      >
        <JsonEditor
          value={json}
          onChange={(newCode) => this.codeChanged(newCode)}
          schema={this.props.schema}
          error={this.state.hasError ? i18n('INVALID_GRID') : undefined}
        />
      </Panel>
    )
  }
}

