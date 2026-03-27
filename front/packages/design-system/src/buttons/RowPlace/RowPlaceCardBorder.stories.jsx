import {RowPlaceCardBorder} from './RowPlaceCardBorder'
import {RowPlaceStatus} from './RowPlaceCard'

export default {
  title: 'Canvas/RowPlaceCard/Border',
  component: RowPlaceCardBorder,
}

const Template = (args) => <RowPlaceCardBorder {...args}/>

export const NotPlaced = Template.bind({})
NotPlaced.args = {
  status: RowPlaceStatus.NOT_PLACED,
}

export const NotPlacedDisabled = Template.bind({})
NotPlacedDisabled.args = {
  status: RowPlaceStatus.NOT_PLACED,
  enabled: false,
}

export const Placing = Template.bind({})
Placing.args = {
  status: RowPlaceStatus.PLACING,
}

export const Saving = Template.bind({})
Saving.args = {
  status: RowPlaceStatus.SAVING,
}

export const Placed = Template.bind({})
Placed.args = {
  status: RowPlaceStatus.PLACED,
}

export const PlacedDisabled = Template.bind({})
PlacedDisabled.args = {
  status: RowPlaceStatus.PLACED,
  enabled: false,
}

export const NotPlacedLarge = Template.bind({})
NotPlacedLarge.args = {
  status: RowPlaceStatus.NOT_PLACED,
  size: 'large',
}

export const NotPlacedDisabledLarge = Template.bind({})
NotPlacedDisabledLarge.args = {
  status: RowPlaceStatus.NOT_PLACED,
  enabled: false,
  size: 'large',
}

export const PlacingLarge = Template.bind({})
PlacingLarge.args = {
  status: RowPlaceStatus.PLACING,
  size: 'large',
}

export const SavingLarge = Template.bind({})
SavingLarge.args = {
  status: RowPlaceStatus.SAVING,
  size: 'large',
}

export const PlacedLarge = Template.bind({})
PlacedLarge.args = {
  status: RowPlaceStatus.PLACED,
  size: 'large',
}

export const PlacedDisabledLarge = Template.bind({})
PlacedDisabledLarge.args = {
  status: RowPlaceStatus.PLACED,
  enabled: false,
  size: 'large',
}


