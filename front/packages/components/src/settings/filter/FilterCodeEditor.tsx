import React from 'react'
import {classToPlain, plainToInstance} from 'class-transformer'
import Ajv from 'ajv'
import {Store} from '../../state/Store'
import {i18n} from '@hopara/i18n'
import {Filter} from '../../filter/domain/Filter'
import {useSelector} from 'react-redux'
import {JsonEditor} from '@hopara/design-system/src/code-editor/JsonEditor'
import { VisualizationEditStatus } from '../../visualization/VisualizationEditStatus'

interface Props {
  filter: Filter;
  onChange: (newFilter: Filter) => void;
}

const ajv = new Ajv({ discriminator: true })

const FilterCodeEditor = ({filter, onChange}: Props) => {
  const schema = useSelector((store: Store) => store.schema) as any
  const isDiscarded = useSelector((store: Store) => store.visualizationStore.editStatus === VisualizationEditStatus.DISCARDED)
  const [hasError, setHasError] = React.useState(false)
  const [filterVersion, setFilterVersion] = React.useState(Date.now())

  React.useEffect(() => {
    if (isDiscarded) setFilterVersion(Date.now())
  }, [isDiscarded])

  const filterSchema = {...schema?.definitions['FilterSpec']}
  filterSchema.definitions = {...schema?.definitions}

  const plainFilter = classToPlain(filter)
  const {id, values, ...filterWithourId} = plainFilter
  const jsonLayer = JSON.stringify(filterWithourId, null, 2)

  const codeChanged = (newCode) => {
    let parsed
    try {
      parsed = JSON.parse(newCode)
    } catch {
      setHasError(true)
      return
    }

    const valid = ajv.validate(filterSchema, parsed)
    parsed.id = id
    parsed.values = values

    if (valid) {
      const newFilter = plainToInstance(Filter, parsed)
      onChange(newFilter as Filter)
      setHasError(false)
    } else {
      setHasError(true)
    }
  }
  return (
      <JsonEditor
        key={filterVersion}
        value={jsonLayer}
        onChange={codeChanged}
        schema={filterSchema}
        error={hasError ? i18n('INVALID_FILTER') : undefined}
      />
  )
}

export default FilterCodeEditor
