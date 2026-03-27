import React from 'react'
import {Details} from './Details'

import {Box} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import {Icon} from '../icons/Icon'

export default {
  title: 'Canvas/Details',
  component: Details,
}

const Template = (args) =>
  <div style={{
    width: '380px',
    display: 'flex',
    flexDirection: 'column',
    placeItems: 'center',
    gap: '1em',
    padding: '1em',
    margin: 'auto',
    fontSize: '13px',
    backgroundColor: 'white',
  }}>
    <Box sx={{
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
    }}>
      <IconButton color="primary">
        <Icon icon="arrow-left"/>
      </IconButton>
      <Box sx={{flex: 1, display: 'flex', justifyContent: 'end'}}>
        <IconButton color="primary">
          <Icon icon="close" />
        </IconButton>
      </Box>
    </Box>
    <Details {...args} />
  </div>

const Default = Template.bind({})
Default.args = {
  iconUrl: 'https://resource.test.hopara.app/tenant/hopara.io/icon/machine',
  layerIcon: <Icon icon="circle-layer" />,
  rowId: 'blau',
  containerId: 'any-container-id',
  onRowPlace: () => alert('placed'),
  onUnplaceClick: () => alert('unplaced'),
  secondaryActions: [],
  detailLines: [],
  onImageUpload: () => {
    alert('image uploaded')
  },
  onModelUpload: () => {
    alert('model uploaded')
  },
}

export const IconWithRowIcon = Template.bind({})
IconWithRowIcon.args = {
  ...Default.args,
}

export const IconWithObjectIcon = Template.bind({})
IconWithObjectIcon.args = {
  ...Default.args,
  iconUrl: undefined,
}

export const IconWithLayerIcon = Template.bind({})
IconWithLayerIcon.args = {
  ...Default.args,
  iconUrl: undefined,
}

export const TitleSmallTitle = Template.bind({})
TitleSmallTitle.args = {
  ...Default.args,
  title: 'Sensor 2396',
}

export const TitleLargeTitle = Template.bind({})
TitleLargeTitle.args = {
  ...Default.args,
  title: 'Material Accessioning Philips #321456 Room 2',
}

export const Min = Template.bind({})
Min.args = {
  ...Default.args,
  title: undefined,
}

export const MainActionWithMainAction = Template.bind({})
MainActionWithMainAction.args = {
  ...Default.args,
  mainAction: {
    title: 'See in Retina',
    onClick: () => alert('Hello'),
  },
}

export const MainActionWitLongMainAction = Template.bind({})
MainActionWitLongMainAction.args = {
  ...Default.args,
  mainAction: {
    title: 'Ver no retina com um título muito grande mesmo para ver como fica',
    onClick: () => alert('Hello'),
  },
}


export const SecondaryActionsWithFewSecondaryActions = Template.bind({})
SecondaryActionsWithFewSecondaryActions.args = {
  ...Default.args,
  secondaryActions: [{
    title: 'Histórico de CO2',
    onClick: () => {
      alert('secondaryAction1')
    },
  }],
}

export const SecondaryActionsWithManySecondaryActions = Template.bind({})
SecondaryActionsWithManySecondaryActions.args = {
  ...Default.args,
  secondaryActions: [
    {
      title: 'Histórico de CO2',
      onClick: () => {
        alert('secondaryAction1')
      },
    },
    {
      title: 'Histórico de Temperatura',
      onClick: () => {
        alert('secondaryAction2')
      },
    },
    {
      title: 'Histórico de Umidade',
      onClick: () => {
        alert('secondaryAction3')
      },
    },
    {
      title: 'Histórico de Pressão',
      onClick: () => {
        alert('secondaryAction4')
      },
    },
    {
      title: 'Histórico de muito grande mesmo para ver como fica sem quebrar a linha',
      onClick: () => {
        alert('secondaryAction5')
      },
    },
  ],
}

export const UploadWithUploading = Template.bind({})
UploadWithUploading.args = {
  ...Default.args,
  isImage: true,
  progress: 25,
  status: 'uploading',
}

export const UploadWithProcessing = Template.bind({})
UploadWithProcessing.args = {
  ...Default.args,
  isImage: true,
  status: 'processing',
}

export const UploadWithIdleImage = Template.bind({})
UploadWithIdleImage.args = {
  ...Default.args,
  status: undefined,
  isImage: true,
  isModel: false,
}

export const UploadWithIdleModel = Template.bind({})
UploadWithIdleModel.args = {
  ...Default.args,
  status: undefined,
  isImage: false,
  isModel: true,
}

export const PlacedWithPlaced = Template.bind({})
PlacedWithPlaced.args = {
  ...Default.args,
  isPlaced: true,
}

export const PlacedWithNotPlaced = Template.bind({})
PlacedWithNotPlaced.args = {
  ...Default.args,
  isPlaced: false,
}


export const TableNoTable = Template.bind({})
TableNoTable.args = {
  ...Default.args,
  detailLines: [],
}

export const TableLargeTable = Template.bind({})
TableLargeTable.args = {
  ...Default.args,
  detailLines: [
    {
      title: 'Sensor id',
      value: '1',
    },
    {
      title: 'Name',
      value: 'Elemental Machine Sensor 1 Room BA24 Elemental Machine Sensor 1 Room BA24',
    },
    {
      title: 'Longitude',
      value: '-71.11',
    },
    {
      title: 'Latitude',
      value: '42.36',
    },
    {
      title: 'Level',
      value: '0.00',
    },
    {
      title: 'Type',
      value: 'refrigerator',
    },
    {
      title: 'Alert',
      value: '0',
    },
    {
      title: 'Model',
      value: 'C3PO',
    },
    {
      title: 'The Most Temperature',
      value: '28',
    }],
}

export const TableSmallTable = Template.bind({})
TableSmallTable.args = {
  ...Default.args,
  detailLines: [
    {
      title: 'Sensor id',
      value: '1',
    },
    {
      title: 'Name',
      value: 'Sensor 1',
    },
    {
      title: 'Longitude',
      value: '-71.11',
    },
  ],
}

export const SensorLabs = Template.bind({})
SensorLabs.args = {
  ...Default.args,
  iconUrl: 'https://resource.test.hopara.app/tenant/hopara.io/icon/machine',
  layerIcon: <Icon icon="circle-layer" />,
  title: 'Hello',
  mainAction: {
    title: 'Ver no Retina',
    onClick: () => alert('visto no Retina'),
  },
  secondaryActions: [
    {
      title: 'string',
      onClick: () => alert('secondary action'),
    },
    {
      title: 'string',
      onClick: () => alert('secondary action'),
    },
  ],
  rowId: 'blau',
  containerId: 'any-container-id',

  userCanEditRow: true,
  rowCanBeUpdated: true,
  isPlaced: false,

  onRowPlace: () => alert('placed'),
  onUnplaceClick: () => alert('unplaced'),

  detailLines: [
    {
      title: 'Sensor id',
      value: '1',
    },
    {
      title: 'Name',
      value: 'Sensor 1',
    },
    {
      title: 'Longitude',
      value: '-71.11',
    },
  ],

  progress: 25,
  status: undefined,
  isImage: true,
  isModel: true,

  onImageUpload: () => {
    alert('image uploaded')
  },
  onModelUpload: () => {
    alert('model uploaded')
  },
}
