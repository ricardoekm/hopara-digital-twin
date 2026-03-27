import React, {ReactElement} from 'react'
import {Layer} from '../Layer'
import {LayerEditorItem} from './LayerEditorItem'
import {SlideTransition, TransitionType} from '@hopara/design-system/src/transitions/SlideTransition'
import {PureComponent} from '@hopara/design-system'
import {layerEditorFactories} from './LayerEditorFactories'
import Visualization from '../../visualization/Visualization'
import {Queries} from '@hopara/dataset'
import {Layers} from '../Layers'

export type StateProps = {
  layer: Layer
  parentLayer?: Layer
  queries: Queries
  layers: Layers
  selectedLayerSubItem?: { id: string, type: string }
  schema: any
  openGroups: string[]
  isAdvancedMode: boolean
  visualization: Visualization
}

export type ActionProps = {
  setOpenGroups: (groups: string[]) => void
  onAdvancedModeClick: (enabled?: boolean) => void
  onBackClick: () => void
  onDuplicateClick: () => void
  onDeleteClick: () => void
  onEjectClick: () => void
}

export type Props = StateProps & ActionProps

interface State {
  transition: TransitionType
}

const actionTransitionType = {
  rootToPrimary: TransitionType.LEFT,
  primaryToRoot: TransitionType.RIGHT,
  primaryToSecondary: TransitionType.LEFT,
  secondaryToPrimary: TransitionType.RIGHT,
}

export class LayerEditorItemComponent extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      transition: TransitionType.LEFT,
    }
  }

  setSlideDirection(direction: TransitionType, callback: any) {
    this.setState({transition: direction}, () => callback && callback())
  }

  handlePrimaryBackClick() {
    return this.setSlideDirection(actionTransitionType.primaryToRoot, () => {
      if (this.props.isAdvancedMode) {
        this.props.onAdvancedModeClick(false)
      } else {
        this.props.onBackClick()
      }
    })
  }

  createEditors(props: {
    visualization: Visualization,
    layer: Layer,
    queries: Queries,
    layers: Layers,
    schema: any
  }): Record<string, React.ReactElement[]> {
    const {visualization, layer, queries, layers, schema} = props
    const editorFactories = layerEditorFactories.getFromLayer(visualization, layer, schema)
    const editors = editorFactories.map((editorFactory, index) => {
      const Component = editorFactory.create
      return {
        group: editorFactory.getGroup(layer),
        component: <Component
          key={`${index} - ${editorFactory.key}`}
          layer={layer}
          queries={queries}
          layers={layers}
          visualization={visualization}
        />,
      }
    })

    return editors.reduce((acc, editorWithComponent) => {
      if (!acc[editorWithComponent.group]) {
        acc[editorWithComponent.group] = []
      }
      acc[editorWithComponent.group].push(editorWithComponent.component as ReactElement)
      return acc
    }, {} as Record<string, React.ReactElement[]>)
  }

  createEditorItemComponent(props: {
    visualization: Visualization,
    layer: Layer,
    editorType: string
  }): (React.ReactElement | null) {
    const {visualization, layer, editorType} = props
    const editors = layerEditorFactories.getFromLayer(visualization, layer, this.props.schema)
    const editorFactory = editors.find((editor) => editor.key === editorType)
    if (!editorFactory?.createItem) {
      return null
    }
    const Component = editorFactory.createItem
    return <Component
      layer={layer}
      layers={this.props.layers}
      queries={this.props.queries}
      visualization={visualization}
    />
  }

  render(): React.ReactNode {
    const transitionKey = this.props.selectedLayerSubItem ? 'secondary' : this.props.layer ? 'primary' : 'root'

    return (
      <SlideTransition
        transition={this.state.transition}
        transitionKey={transitionKey}
        invert={false}
      >
        {this.props.layer && !this.props.selectedLayerSubItem && (
          <LayerEditorItem
            layer={this.props.layer}
            parentLayer={this.props.parentLayer}
            components={this.createEditors(this.props)}
            openGroups={this.props.openGroups}
            setOpenGroups={this.props.setOpenGroups}
            isAdvancedMode={this.props.isAdvancedMode}
            onBackClick={() => this.handlePrimaryBackClick()}
            onAdvancedModeClick={this.props.onAdvancedModeClick}
            onDuplicateClick={this.props.onDuplicateClick}
            onDeleteClick={this.props.onDeleteClick}
            onEjectClick={this.props.onEjectClick}
          />
        )}
        {this.props.layer && this.props.selectedLayerSubItem && this.createEditorItemComponent({
          ...this.props,
          editorType: this.props.selectedLayerSubItem.type,
        })}
      </SlideTransition>
    )
  }
}
