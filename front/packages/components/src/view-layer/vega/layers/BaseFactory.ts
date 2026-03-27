import { Rowsets } from '../../../rowset/Rowsets'
import { DataComparator } from '../../DataComparator'
import { InteractionCallbacks } from '../../deck/interaction/Interaction'

export type FactoryProps = {
  cacheKey:string, 
  dataComparator: DataComparator
  targetView?: string
  callbacks: InteractionCallbacks
  rowsets: Rowsets
}

export function getDeckProps(id: string, data:any, props: FactoryProps): any {
    props.dataComparator.update(id, {cacheKey: props.cacheKey})
    return {
      id,
      data,
      dataComparator: props.dataComparator.isEqual(id),
    }
  }
