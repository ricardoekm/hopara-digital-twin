import React from 'react'
import {Select, SelectOption} from '@hopara/design-system/src/form'
import {ClusterTransform} from '../../../transform/ClusterTransform'
import {i18n} from '@hopara/i18n'
import Case from 'case'
import {UnitTransform} from '../../../transform/UnitTransform'
import {ClusterEditor} from './ClusterEditor'
import {UnitEditor} from './UnitEditor'
import {PureComponent} from '@hopara/design-system'
import {Layer} from '../../Layer'
import {Layers} from '../../Layers'
import {Columns, INTERNAL_DATA_SOURCE, Queries} from '@hopara/dataset'
import {Transform} from '@hopara/encoding'
import {NeighborCountTransform} from '../../../transform/NeighborCountTransform'
import {PanelGroup} from '@hopara/design-system/src/panel/PanelGroup'
import {NeighborCountEditor} from './NeighborCountEditor'

export interface StateProps {
  transform: Transform
  layer: Layer
  layerQueryColumns?: Columns
  layers: Layers
  options: string[]
  queries: Queries
  notComplexOptions: SelectOption[]
  coordinatesOptions: SelectOption[]
  visible: boolean
  dataSource: string
}

export interface ActionProps {
  onChange: (transform: Transform) => void;
}

type Props = StateProps & ActionProps

class TransformEditor extends PureComponent<Props> {
  constructor(props: Props) {
    super(props)

    this.onTypeChange = this.onTypeChange.bind(this)
  }

  onTypeChange(event: { target: { value: any } }) {
    let newTransform: Transform | undefined = undefined
    const value = event.target.value

    if (value === 'cluster') {
      newTransform = new ClusterTransform()
    } else if (value === 'unit') {
      newTransform = new UnitTransform()
    } else if (value === 'neighbor_count') {
      newTransform = new NeighborCountTransform()
    }

    this.props.onChange(newTransform as Transform)
  }

  getType(): string | undefined {
    return Case.snake(this.props.transform?.type ?? '').toLowerCase()
  }

  getTypeOptions(): SelectOption[] {
    const availableOptions = this.props.options.map((option: string) => Case.snake(option).toLowerCase())
    const currentOption = this.getType()

    const options = availableOptions.map((option: string) => ({
      label: Case.sentence(option),
      value: option,
    }))

    if (currentOption && availableOptions.indexOf(currentOption) < 0) {
      options.unshift({
        label: 'Custom',
        value: currentOption,
      })
    }

    return options
  }

  render() {
    if (this.props.dataSource === INTERNAL_DATA_SOURCE) return

    const typeOptions = this.getTypeOptions()
    const options = [
      {'label': typeOptions.length ? i18n('NONE') : i18n('SELECT_A_QUERY_FIRST')},
      ...this.getTypeOptions(),
    ]

    if (!this.props.visible) {
      return null
    }

    return (<>
        <PanelGroup title={i18n('TRANSFORM')} inline>
          <Select
            value={this.getType()}
            options={options}
            onChange={this.onTypeChange}
            placeholder=""
            disabled={typeOptions.length === 0}
          />
        </PanelGroup>

        {this.getType() === 'cluster' && <ClusterEditor
          cluster={this.props.transform as ClusterTransform}
          onChange={(cluster: ClusterTransform) => {
            this.props.onChange(cluster)
          }}
        />}

        {this.getType() === 'unit' && <UnitEditor
          unit={this.props.transform as UnitTransform}
          queryColumns={this.props.layerQueryColumns}
          options={this.props.notComplexOptions}
          onChange={(unit: UnitTransform) => {
            this.props.onChange(unit)
          }}
        />}

        {this.getType() === 'neighbor_count' && <NeighborCountEditor
          neighborCount={this.props.transform as NeighborCountTransform}
          onChange={(neighborCount: NeighborCountTransform) => {
            this.props.onChange(neighborCount)
          }}
        />}
      </>
    )
  }
}

export default TransformEditor
