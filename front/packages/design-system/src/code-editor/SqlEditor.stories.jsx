import React from 'react'
import {SqlEditor} from './SqlEditor'

export default {
  title: 'Components/Code Editor SQL',
  component: SqlEditor,
}

const Template = (args) => <SqlEditor {...args} />

export const Full = Template.bind({})
Full.args = {
  height: 400,
  value: `-- this is a comment
  WITH temp1 AS (
    SELECT column1, column2, SUM(column3) AS total
    FROM table1
    WHERE column4 = 'value1'
    GROUP BY column1, column2
), temp2 AS (
    SELECT column5, AVG(column6) AS avg_col6
    FROM table2
    WHERE column7 = 'value2'
    GROUP BY column5
)
SELECT t1.column1, t1.column2, t1.total, t2.avg_col6
FROM temp1 t1
JOIN temp2 t2
ON t1.column1 = t2.column5
WHERE t1.total > (t2.avg_col6 * 100)`,
}
