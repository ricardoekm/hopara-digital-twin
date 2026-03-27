import {Box} from '@mui/material'

export default {
    title: 'Styles/Shadow',
    component: Box,
}

const Template = (args) => <Box {...args} />

export const Shadow1 = Template.bind({})
Shadow1.args = {
    sx: {
        width: 200,
        height: 200,
        backgroundColor: 'white',
        boxShadow: 1,
    },
}

export const Shadow2 = Template.bind({})
Shadow2.args = {
    sx: {
        width: 200,
        height: 200,
        backgroundColor: 'white',
        boxShadow: 2,
    },
}

export const Shadow3 = Template.bind({})
Shadow3.args = {
    sx: {
        width: 200,
        height: 200,
        backgroundColor: 'white',
        boxShadow: 3,

    },
}

export const Shadow4 = Template.bind({})
Shadow4.args = {
    sx: {
        width: 200,
        height: 200,
        backgroundColor: 'white',
        boxShadow: 4,
    },
}

export const Shadow5 = Template.bind({})
Shadow5.args = {
    sx: {
        width: 200,
        height: 200,
        backgroundColor: 'white',
        boxShadow: 5,
    },
}


