import React from 'react'
import {HoparaSymbols, hoparaSymbolKeys} from './HoparaSymbols'

export default {
  title: 'Icons/Symbols',
  component: HoparaSymbols,
}

const Template = (args) => <div style={{
  display: 'flex',
  flexWrap: 'wrap',
  gap: 20,
  padding: 20,
  border: '1px solid #f0f0f0',
  borderRadius: 5,
}} {...args} />

const Text = (props) => <span
  style={{
    marginTop: 5,
    textAlign: 'center',
    textOverflow: 'ellipsis',
    width: 100,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontSize: 11,
  }}
>{props.children}</span>

const Container = (props) => {
  return <div style={{
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'column',
  }}>{props.children}</div>
}

export const Default = Template.bind({})
Default.args = {
  children: hoparaSymbolKeys.map((icon) => (
    <Container key={icon}>
      <HoparaSymbols icon={icon} />
      <Text>{icon}</Text>
    </Container>
  )),
}
