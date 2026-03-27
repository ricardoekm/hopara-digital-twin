import pluralize from 'pluralize'
import { PaginatedRowset } from '../paginated-rowset/PaginatedRowset'

function getSingularName(layerName: string) {
  if (layerName.toLowerCase() == 'imagens') {
    return 'imagem'
  }

  return pluralize.singular(layerName.toLowerCase())
}

export function getNewRowName(layerName: string, rowset: PaginatedRowset) {
  const singularName = getSingularName(layerName)
  // Do we have everything?
  if (rowset.lastPage) {
    return singularName + ` ${rowset.rows.length + 1}`
  }

  return 'new ' + singularName
}
