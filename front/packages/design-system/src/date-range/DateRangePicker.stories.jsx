import {DateRangePicker} from './DateRangePicker'
import dayjs from 'dayjs'

export default {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
}

const Template = (args) => <DateRangePicker {...args} />
export const Empty = Template.bind({})
Empty.args = {
  fieldName: 'Any Field Name',
  onChange: (e) => {
    alert(JSON.stringify(e))
  },
}

export const WithValue = Template.bind({})
WithValue.args = {
  fieldName: 'Any Field Name',
  initialDate: dayjs('2021-01-01').toDate(),
  finalDate: dayjs('2021-01-31').toDate(),
  onChange: (d1, d2) => {
    alert(d1 + ' - ' + d2)
  },
}
