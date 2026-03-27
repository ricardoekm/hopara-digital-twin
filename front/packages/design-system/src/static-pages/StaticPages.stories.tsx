import React from 'react'
import {NotFoundPage} from './NotFoundPage'
import {ForbiddenPage} from './ForbiddenPage'

export default {
  title: 'Static Pages/Pages',
}

const NotFoundTemplate = () => <NotFoundPage />
export const NotFound = NotFoundTemplate.bind({})

const ForbiddenTemplate = () => <ForbiddenPage />
export const Forbidden = ForbiddenTemplate.bind({})
