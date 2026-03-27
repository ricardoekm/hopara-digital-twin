import React from 'react'
import { TemplateCard } from './TemplateCard'
import { Authorization } from '@hopara/authorization'
import { CardListTemplateSkeleton } from '@hopara/design-system/src/card-list/CardListSkeleton'
import { CardListTemplate } from '@hopara/design-system/src/card-list/CardList'
import { Box } from '@mui/material'
import { useTheme } from '@hopara/design-system/src'
import { Template } from './domain/Template'
import { ErrorPanel } from '@hopara/design-system/src/error/ErrorPanel'
import { Title } from '@hopara/design-system/src/Title'
import { i18n } from '@hopara/i18n'

interface Props {
  isLoading: boolean;
  templates: Template[];
  authorization: Authorization;
  error?: string;
}

export const TemplateList = (props: Props) => {
  const theme = useTheme()
  const { isLoading, templates } = props

  if (props.error) {
    return <ErrorPanel error={props.error} />
  }

  return (
    <Box
      sx={{
        marginBlockStart: '3em',
        [theme.breakpoints.down('sm')]: {
          display: 'none',
        },
      }}
    >
      <div>
        <Title>
          {i18n('CREATE_A_VISUALIZATION')}
        </Title>
      </div>

      {!isLoading && (
        <CardListTemplate id="spotlight-1">
          {templates.map((template, i) => (
            <TemplateCard key={i} template={template} />
          ))}
        </CardListTemplate>
      )}
      {isLoading && !templates.length && (
        <CardListTemplateSkeleton count={4} size="medium" />
      )}
    </Box>
  )
}
