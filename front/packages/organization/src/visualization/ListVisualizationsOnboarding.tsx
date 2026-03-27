import { Empty } from '@hopara/design-system/src/empty/Empty'
import { SpotlightTrigger } from '@hopara/design-system/src/spotlight'
import { i18n } from '@hopara/i18n'
import React from 'react'

interface Props {
  hasDataSources: boolean
  isPersonalSpace: boolean
}

export class ListVisualizationsOnboarding extends React.Component<Props> {
  render() {
    if (!this.props.hasDataSources) {
      return (
        <Empty
          icon="helper"
          description={
          <>
            {this.props.isPersonalSpace && (
              <>
                {i18n('THIS_IS_YOUR')}&nbsp;
                <SpotlightTrigger elementId="spotlight-7">
                  {i18n('PERSONAL_SPACE')}
                </SpotlightTrigger>
                {i18n('ONLY_VISIBLE_TO_YOU')}
              </>
            )}
            &nbsp;{i18n('YOU_CAN_START_BY')}&nbsp;
            <SpotlightTrigger elementId="spotlight-2">
              {i18n('ADDING_YOUR_DATA')}
            </SpotlightTrigger>
            &nbsp;{i18n('OR')}&nbsp;
            <SpotlightTrigger elementId="spotlight-5">
              {i18n('PLAYING_WITH_OUR_SAMPLE_VISUALIZATIONS')}
            </SpotlightTrigger>
            .
          </>
        }
      />
      )
    }
    return (
      <Empty
        icon="helper"
        description={
          <>
            {i18n('NOW_THAT_YOU_HAVE_ADDED_SOME_DATA_YOU_CAN')}&nbsp;
            <SpotlightTrigger elementId="spotlight-1">
              {i18n('CREATE_A_VISUALIZATION_LOWER')}
            </SpotlightTrigger>
            &nbsp;{i18n('AND_ADD_LAYERS_TO_IT')}.
          </>
        }
      />
    )
  }
}
