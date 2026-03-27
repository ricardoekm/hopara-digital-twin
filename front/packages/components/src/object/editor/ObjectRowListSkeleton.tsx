import React from 'react'
import {Box, Skeleton} from '@mui/material'
import {PureComponent} from '@hopara/design-system'

interface Props {
  count: number
}

export class ObjectRowListSkeleton extends PureComponent<Props> {
  render() {
    return <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      marginTop: 12,
    }}>
      {[...Array(this.props.count)].map((_, index) => (
        <Box
          key={index}
          sx={{
            display: 'grid',
            gridTemplateColumns: '80px 1fr',
            gap: 12,
            padding: '5px 11px',
          }}>
          <Skeleton
            height="55px"
            width="100%"
            variant="rounded"
          />
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            gap: 8,
            justifyContent: 'center',
          }}>
            <Skeleton
              height="17px"
              width="80%"
              variant="rounded"
            />
            <Skeleton
              height="17px"
              width="60%"
              variant="rounded"
            />
          </Box>
        </Box>
      ))}
    </Box>
  }
}
