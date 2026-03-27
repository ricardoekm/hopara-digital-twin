import React from 'react'
import {Title} from '@hopara/design-system/src/Title'
import {VisualizationCard} from './VisualizationCard'
import {i18n} from '@hopara/i18n'
import {CardListSkeleton} from '@hopara/design-system/src/card-list/CardListSkeleton'
import {CardList} from '@hopara/design-system/src/card-list/CardList'
import {useTheme} from '@hopara/design-system/src'
import {ErrorPanel} from '@hopara/design-system/src/error/ErrorPanel'
import {Skeleton} from '@mui/material'
import { Empty } from '@hopara/design-system/src/empty/Empty'

const IMAGES_URL = 'https://images.hopara.app'

interface Props {
  isLoading: boolean;
  notSampleVisualizations: any[];
  sampleVisualizations: any[];
  areSampleVisualizationsReady?: boolean;
  tenant: string;
  error?: string;
  onDelete: (visualizationId: string) => void;
  onRename: (visualizationId: string, newName: string) => void;
}

const VisualizationsSkeleton = () => (
  <>
    <Skeleton width={240} height={32}/>
    <CardListSkeleton count={3}/>
  </>
)

export const VisualizationList = (props: Props) => {
  const theme = useTheme()
  const {isLoading, sampleVisualizations, notSampleVisualizations, tenant} = props

  if (props.error) {
    return <ErrorPanel error={props.error}/>
  }

  return (
    <>
      {isLoading && !notSampleVisualizations.length && <VisualizationsSkeleton/>}
      {!isLoading && !!notSampleVisualizations.length && (
        <>
          <CardList id="visualization-list">
            {notSampleVisualizations.map((visualization, i) => {
              const imageUrl =
                visualization.backgroundImage ??
                `${IMAGES_URL}/tenant/${tenant}/visualization/${visualization.id}.png`
              return (
                <VisualizationCard
                  key={visualization.name + i}
                  id={visualization.id}
                  name={visualization.name}
                  imageUrl={imageUrl}
                  onDelete={() => props.onDelete(visualization.id)}
                  onRename={(newName: string) => props.onRename(visualization.id, newName)}
                  onDuplicate={() => undefined}
                />
              )
            })}
          </CardList>
        </>
      )}
      {!isLoading && (<div id="spotlight-5">
        <Title
          sx={{
            [theme.breakpoints.down('sm')]: {
              margin: '0 auto',
            },
          }}
        >
          {i18n('SAMPLE_VISUALIZATIONS')}
        </Title>
        {!props.areSampleVisualizationsReady && (
          <Empty
            icon="progress-activity"
            description={i18n('CREATING_YOUR_SAMPLE_VISUALIZATIONS')}
            noBorder
          />
        )}
        <CardList id="visualization-list">
          {sampleVisualizations.map((visualization, i) => {
            const imageUrl =
              visualization.backgroundImage ??
              `${IMAGES_URL}/sample-visualizations/${visualization.id}.png`
            return (
              <VisualizationCard
                key={visualization.name + i}
                id={visualization.id}
                name={visualization.name}
                imageUrl={imageUrl}
                onDelete={() => props.onDelete(visualization.id)}
                onRename={(newName: string) => props.onRename(visualization.id, newName)}
                onDuplicate={() => undefined}
              />
            )
          })}
        </CardList>
      </div>)}
    </>
  )
}
