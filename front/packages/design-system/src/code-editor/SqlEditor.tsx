import React from 'react'
import {PureComponent} from '../component/PureComponent'
import {CodeEditor, CodeEditorProps} from './CodeEditor'

export class SqlEditor extends PureComponent<CodeEditorProps> {
  render() {
    return <CodeEditor 
      {...this.props}
      language="sql"
    />
  }
}
