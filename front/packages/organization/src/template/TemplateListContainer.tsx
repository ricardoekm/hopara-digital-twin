import React, {useContext, useEffect} from 'react'
import {Template} from './domain/Template'
import {TemplateList} from './TemplateList'
import {AuthContext} from '@hopara/auth-front/src/contexts/AuthContext'
import {VisualizationContext} from '../visualization/service/VisualizationContext'
import { Logger } from '@hopara/internals'

export const TemplateListContainer = () => {
  const authContext = useContext(AuthContext)
  const appContext = useContext(VisualizationContext)

  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [templates, setTemplates] = React.useState<Template[]>([])

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const payload = await appContext.templateService.list()
        const templates = payload.map((template) => new Template(template))
        setTemplates(templates)
      } catch (err: any) {
        Logger.error(err)
        setError(err?.message)
      }
      setLoading(false)
    })()
  }, [appContext, setLoading, setTemplates, authContext])

  return <TemplateList
    isLoading={loading}
    templates={templates}
    authorization={authContext.authorization}
    error={error}
  />
}
