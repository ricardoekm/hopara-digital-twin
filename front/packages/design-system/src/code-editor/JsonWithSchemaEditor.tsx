import React, {useState} from 'react'
import Ajv from 'ajv'
import {JsonEditor} from './JsonEditor'
import { CodeEditorProps } from './CodeEditor'

interface Props extends CodeEditorProps {
  schema: any;
  errorMessage: string;
}

const ajv = new Ajv({ discriminator: true })

const JsonWithSchemaEditor = ({value, schema, onChange, errorMessage, onCtrlEnter}: Props) => {
  const [hasError, setHasError] = useState(false)
  const jsonObject = JSON.stringify(value, null, 2)

  const codeChanged = (newCode) => {
    let parsed
    try {
      parsed = JSON.parse(newCode)
    } catch {
      setHasError(true)
      return
    }
    const valid = ajv.validate(schema, parsed)

    if (valid) {
      onChange(parsed)
      setHasError(false)
    } else {
      setHasError(true)
    }
  }
  return (
    <>
      <JsonEditor
        height="100%"
        value={jsonObject}
        onChange={codeChanged}
        schema={schema}
        error={hasError ? errorMessage : undefined}
        onCtrlEnter={onCtrlEnter}
      />
    </>
  )
}

export default JsonWithSchemaEditor
