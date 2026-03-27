import { last } from 'lodash'
import { LayerFactory } from './LayerFactory'

export abstract class LayerFactoryChain<P> implements LayerFactory<P> {
  nextFactory: LayerFactory<P>

  setNextFactory(nextFactory:LayerFactory<P>) {
    this.nextFactory = nextFactory
  }

  chain(props:P) {
    return this.nextFactory.create(props)
  }

  abstract create(props: P);
}


export function createFactoryChain<P>(decorators:LayerFactoryChain<P>[], factory:LayerFactory<P>) {
  for (let i = 0; i < decorators.length - 1; i++) {
    decorators[i].setNextFactory(decorators[i + 1])
  }

  last(decorators)?.setNextFactory(factory)

  return decorators[0]
}
