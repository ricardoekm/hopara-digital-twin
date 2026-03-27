import React from 'react'
import {ToastContainer} from './ToastContainer'
import {toastError, toastSuccess} from './Toast'

export default {
    title: 'Components/Toast',
    component: ToastContainer,
}

const Template = (args) => <><ToastContainer/>
    <button {...args}>Click me</button>
</>

export const Success = Template.bind({})
Success.args = {
    onClick: () => toastSuccess('Success message'),
}

export const SuccessWithUndo = Template.bind({})
SuccessWithUndo.args = {
    onClick: () => toastSuccess('Success message', () => alert('undo')),
}

export const Error = Template.bind({})
Error.args = {
    onClick: () => toastError('Error message'),
}
