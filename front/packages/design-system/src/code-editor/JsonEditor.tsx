import React from 'react'
import {PureComponent} from '../component/PureComponent'
import {CodeEditor, CodeEditorProps} from './CodeEditor'
import {Box} from '@mui/material'

export interface JsonEditorProps extends CodeEditorProps {
  schema?: any
}

export class JsonEditor extends PureComponent<JsonEditorProps> {
  render() {
    const {height = '50vh', ...rest} = this.props

    return (
      <Box sx={{ height }}>
        <CodeEditor
          {...rest}
          language="json"
        />
      </Box>
    )
  }
} 
