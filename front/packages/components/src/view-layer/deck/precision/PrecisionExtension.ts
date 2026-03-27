import {LayerExtension} from '@deck.gl/core'

export class PrecisionExtension extends LayerExtension {
  // eslint-disable-next-line no-restricted-syntax
  static get componentName() {
    return 'PrecisionFix'
  }

  getShaders(extensions: any) {
    return {
      ...super.getShaders(extensions),
      inject: {
        'vs:#decl': `
          invariant gl_Position;
        `,
      },
    }
  }
}
