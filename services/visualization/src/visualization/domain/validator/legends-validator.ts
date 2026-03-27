import {LayerNotFoundError} from '../../../layer/layer-not-found-error.js'
import LayerImpl from '../../../layer/domain/LayerImpl.js'
import { ValidationError, ValidationErrorSeverity } from '../../../validation.js'
import { Legend } from '../spec/Visualization.js'


export class LegendsValidator {
  hasColorChild(layer:LayerImpl): boolean {
    return !!(layer.children && layer.children.some((child) => child.encoding?.color?.field))
  }

  validate(legends: Legend[] | undefined, layers: LayerImpl[]): ValidationError[] {
    const errors = [] as any[]
    if ( !legends ) {
      return errors
    }

    for ( const legend of legends ) {
      const layer = layers.find((layer) => layer.id === legend.layer )
      if ( !layer ) {
        errors.push(new LayerNotFoundError(legend.layer, 'legend'))
      } else if ( !layer.encoding?.color?.field ) {
        if ( !this.hasColorChild(layer) && !legend.items) {
          errors.push(new ValidationError('LegendReferenceError',
                                          ValidationErrorSeverity.WARNING,
                                          `Legend is pointing to a layer without color scale: ${legend.layer}.` +
                                          'You can manually specify the legend by setting the items attribute in the advanced mode.'
                                          ))
        }
      }
     }

     return errors
  }
}
