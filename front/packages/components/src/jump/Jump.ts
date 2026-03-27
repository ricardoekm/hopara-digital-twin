import {classToPlain} from 'class-transformer'
import { VisualizationJump } from '../action/Action'
import { SelectedFilter } from '../filter/domain/SelectedFilter'

export const createJumpUrl = (
  action: VisualizationJump, tenant: string, filters: SelectedFilter[]) => {
  const qs = new URLSearchParams()

  filters.forEach((filter) => qs.append('filter', JSON.stringify(classToPlain(filter))))

  return `/${tenant}/visualization/${action.visualization}?${qs.toString()}`
}
