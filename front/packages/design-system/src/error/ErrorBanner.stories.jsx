import React from 'react'
import {i18n} from '@hopara/i18n'
import {ErrorBanner} from './ErrorBanner'

export default {
  title: 'Components/Error Banner',
  component: ErrorBanner,
}

const Template = (args) => <div style={{display: 'grid', minHeight: '100vh', placeItems: 'center'}}><ErrorBanner {...args} /></div>
export const Banner = Template.bind()
Banner.args = {
  message: i18n('ERROR_FETCHING_ROWS'),
}
