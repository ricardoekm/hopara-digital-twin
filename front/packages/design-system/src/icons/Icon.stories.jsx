import React from 'react'
import {Icon, hoparaIconKeys} from './Icon'

export default {
  title: 'Icons/Icons',
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg', 'xl', 'custom'],
      control: {type: 'select'},
    },
    value: {
      control: {type: 'range', min: 0, max: 240, step: 8}, if: {arg: 'size', eq: 'custom'},
    },
  },
}

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

const IconsTemplate = (args) => <div style={{
  display: 'flex',
  flexWrap: 'wrap',
  gap: 20,
  padding: 20,
}}>
  {hoparaIconKeys.map((icon) => (
    <Container key={icon}>
      <Icon icon={icon} size={args.value || args.size}/>
      <Text>{icon}</Text>
    </Container>
  ))}
</div>


export const HoparaIcons = IconsTemplate.bind({})
HoparaIcons.args = {
  size: 'md',
}

const IconGridTemplate = (args) => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 20,
      padding: 20,
    }}>
      {hoparaIconKeys.map((icon, i) => (
        <div
          key={i}
          style={{
            'boxSizing': 'border-box',
            'display': 'grid',
            'gap': 10,
            'placeItems': 'center',
            'color': 'black',
            'textAlign': 'center',
            'pointerEvents': 'none',
            'width': args.value,
            'height': args.value,
            'border': '1px solid rgba(0,0,0,0.1)',
            'backgroundSize': `${args.value * 0.041667}px ${args.value * 0.041667}px`,
            'boxShadow': '0px 2px 5px -2px rgba(0, 0, 0, 0.22)',
            'backgroundColor': 'white',
            'backgroundImage': `
                    linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                  `,
            'backgroundPosition': '-2px -2px',
          }}
        >
          <div style={{
            gridArea: '1/1/2/2',
            marginLeft: -1,
            marginTop: -1,
          }}>
            <Icon icon={icon} size={args.value}/>
          </div>
        </div>
      ))}
    </div>
  )
}

export const Grid = IconGridTemplate.bind({})
Grid.args = {
  value: 240,
  size: 'custom',
}
