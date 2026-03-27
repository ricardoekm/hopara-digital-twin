import React from 'react'
import { PureComponent } from '@hopara/design-system'
import Ajv from 'ajv'
import {i18n} from '@hopara/i18n'
import Visualization from '../../../visualization/Visualization'
import { Panel } from '@hopara/design-system/src/panel/Panel'
import {PanelTitleBar} from '@hopara/design-system/src/panel/PanelTitleBar'
import {JsonEditor} from '@hopara/design-system/src/code-editor/JsonEditor'

export interface StateProps {
  obj: any;
  schema: any;
  visible: boolean;
  lagendVersion: string;
}

export interface ActionProps {
  onChange: (visualization: Partial<Visualization>) => void;
  onBackClick: () => void;
}

type Props = StateProps & ActionProps

const ajv = new Ajv({ discriminator: true })

export class CodeEditorPanel extends PureComponent<Props, { hasError: boolean, lagendVersion: string }> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      lagendVersion: '',
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
  
  componentDidUpdate(): void {
    if (this.props.lagendVersion) {
      this.setState({lagendVersion: this.props.lagendVersion})
    }
  }

  render() {
    const json = JSON.stringify(this.props.obj, null, 2)

    return (
      <Panel
        header={<PanelTitleBar
          title={i18n('COLOR_LEGENDS')}
          onBackClick={this.props.visible ? () => this.props.onBackClick() : undefined}
        />}
      >
        <JsonEditor
          key={this.state.lagendVersion}
          value={json}
          onChange={(newCode) => this.codeChanged(newCode)}
          schema={this.props.schema}
          error={this.state.hasError ? i18n('INVALID_COLOR_LEGENDS') : undefined}
        />
      </Panel>
    )
  }
}

