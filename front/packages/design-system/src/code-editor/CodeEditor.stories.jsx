import React from 'react'
import {CodeEditor, CodeEditorFontSize} from './CodeEditor'

export default {
  title: 'Components/Code Editor Base',
  component: CodeEditor,
}

const Template = (args) => <CodeEditor {...args} />

export const LargeFontSize = Template.bind({})
LargeFontSize.args = {
  language: 'json',
  height: 300,
  fontSize: CodeEditorFontSize.Large,
  value: `{"test": "LARGE FONT SIZE"}`,
}
