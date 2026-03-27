import React from 'react'
import {PureComponent} from '@hopara/design-system'
import {Layer} from '../../Layer'
import {plainToInstance} from 'class-transformer'
import Ajv from 'ajv'
import {JsonEditor} from '@hopara/design-system/src/code-editor/JsonEditor'
import {i18n} from '@hopara/i18n'
import { classToPlain } from 'class-transformer'

export interface StateProps {
  layer: Layer
  schema: any
  layerVersion: string
}

export interface ActionProps {
  onChange: (newLayer: Layer) => void;
}

type Props = StateProps & ActionProps

type State = { hasError: boolean, layerSchema: any, renderVersion: number, wasEdited: boolean, layerVersion: string }

const ajv = new Ajv({discriminator: true})

export class LayerCodeEditor extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    const layerSchema = {...this.props.schema?.definitions['LayerSpec']}
    layerSchema.definitions = {...this.props.schema?.definitions}
    this.state = {
      hasError: false,
      layerSchema,
      renderVersion: 0,
      wasEdited: false,
      layerVersion: '',
    }
  }

  codeChanged(newCode: string) {
    let parsed: any
    let forceRerender = false
    const wasEdited = true

    try {
      parsed = JSON.parse(newCode)
      forceRerender = this.props.layer.getRawId() !== parsed.id
      parsed.id = this.props.layer.getRawId()
    } catch {
      this.setState({hasError: true, wasEdited})
      return
    }
    
    const valid = ajv.validate(this.state.layerSchema, parsed)
    const renderVersion = forceRerender ? this.state.renderVersion + 1 : this.state.renderVersion

    if (valid) {
      const newLayer = plainToInstance(Layer, parsed)
      newLayer.parentId = this.props.layer.parentId
      this.setState({hasError: false, renderVersion, wasEdited}, () => {
        this.props.onChange(newLayer as Layer)
      })
    } else {
      this.setState({hasError: true, renderVersion, wasEdited})
    }
  }

  componentDidUpdate(): void {
    if (this.props.layerVersion && this.state.wasEdited) {
      this.setState({wasEdited: false, layerVersion: this.props.layerVersion})
    }
  }

  render() {
    const plainLayer = classToPlain(this.props.layer)
    const jsonLayer = JSON.stringify(plainLayer, null, 2)

    return (
      <JsonEditor
        height="100%"
        key={this.state.renderVersion + this.props.layer.getId() + this.state.layerVersion}
        value={jsonLayer}
        onChange={(newCode) => this.codeChanged(newCode)}
        schema={this.state.layerSchema}
        error={this.state.hasError ? i18n('INVALID_LAYER') : undefined}
      />
    )
  }
}

