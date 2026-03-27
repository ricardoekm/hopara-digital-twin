import React from 'react'
import { RowToolbarContainer } from '../../row/RowToolbarContainer'
import { PureComponent } from '@hopara/design-system'
import { CanvasHelperContainer } from '../../helper/CanvasHelperContainer'
import { Box } from '@mui/material'

export class TopNavigationComponent extends PureComponent {
  render() {
    return (
      <Box sx={{
        gridArea: 'top',
        height: 'fit-content',
        justifySelf: 'center',
      }}>
        <CanvasHelperContainer />
        <RowToolbarContainer />
      </Box>
    )
  }
}
