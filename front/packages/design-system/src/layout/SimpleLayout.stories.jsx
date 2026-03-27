import React from 'react'
import {styled} from '../theme'
import {SimpleLayout} from './SimpleLayout'
import {Box} from '@mui/system'

export default {
  title: 'Layout/Simple',
}

const TemplatePosition = styled(Box, {name: 'TemplatePosition'})({
  display: 'grid',
  width: '100%',
  height: '100%',
  border: '1px dashed #ddd',
  placeItems: 'center',
  padding: 6,
})

const Template = (args) => <SimpleLayout symbol={args.withSymbol ? <TemplatePosition>Symbol Position</TemplatePosition> : null}
                                         title={args.withTitle ? <TemplatePosition>Title Position</TemplatePosition> : null}
                                         content={args.withContent ? <TemplatePosition>Content Position</TemplatePosition> : null} />

export const Base = Template.bind({})
Base.args = {
  withSymbol: true,
  withTitle: true,
  withContent: true,
}
