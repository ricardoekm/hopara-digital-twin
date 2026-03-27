import { Empty } from '@hopara/design-system/src/empty/Empty'
import { SpotlightTrigger } from '@hopara/design-system/src/spotlight'
import { i18n } from '@hopara/i18n'
import React from 'react'
import {Link} from '@mui/material'

export class ListDataSourcesOnboarding extends React.Component {
  render() {
    return (
      <Empty
        icon="helper"
        description={
          <>
            {i18n('YOU_CAN')}&nbsp;
            {i18n('CONNECT_TO_YOUR_DATABASE_BY')}&nbsp;
            <SpotlightTrigger elementId="spotlight-6">
              {i18n('SELECTING_ITS_TYPE')}
            </SpotlightTrigger>
            &nbsp;{i18n('OR')}&nbsp;
            {i18n('UPLOAD_A_CSV_JSON_FILE')}&nbsp;
            <SpotlightTrigger elementId="spotlight-3">
              {i18n('CREATING_A_FILE_DATA_SOURCE')}
            </SpotlightTrigger>
            .&nbsp;{i18n('YOU_CAN_ALSO')}&nbsp;
            <Link href='https://docs.hopara.app/tutorials/visualizing-asset-data-on-a-map' target="_blank">
              {i18n('TUTORIALS')}
            </Link>.
          </>
        }
      />
    )
  }
}
