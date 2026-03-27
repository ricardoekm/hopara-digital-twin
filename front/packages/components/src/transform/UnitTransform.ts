import {Transform, TransformType} from '@hopara/encoding/src/transform/Transform'

type Group = {
  field: string
  limit: number
}

type Sort = {
  field?: string
  order: 'ASC' | 'DESC'
}

export class UnitTransform implements Transform {
  type: TransformType
  group: Group
  sort?: Sort

  constructor(props: Partial<UnitTransform> = {}) {
    this.type = TransformType.unit
    Object.assign(this, props)
    if (this.group) {
      this.group.limit = this.group.limit ?? 30
    }
    if (this.sort) {
      this.sort.order = this.sort.order ?? 'ASC'
    }
  }

  isRowProcessing(): boolean {
    return false
  }

  isRowPlacing(): boolean {
      return false
  }

  isFrontOnly(): boolean {
    return false
  }

  isZoomBased(): boolean {
      return false
  }

  isFetchable(): boolean {
      return !!this.group?.field
  }

  getParams() {
    return {
      groupColumn: this.group?.field,
      groupLimit: this.group?.limit,
      sortColumn: this.sort?.field,
      sortOrder: this.sort?.order,
    }
  }

  immutableSetGroupBy(value: string) {
    return new UnitTransform({...this, group: {field: value, limit: this.group?.limit}})
  }

  immutableSetGroupLimit(value: number) {
    return new UnitTransform({...this, group: {field: this.group?.field, limit: value}})
  }

  immutableSetSortBy(value: string) {
    return new UnitTransform({...this, sort: {field: value, order: this.sort?.order}})
  }

  immutableSetSortOrder(value: 'ASC' | 'DESC') {
    return new UnitTransform({...this, sort: {field: this.sort?.field, order: value}})
  }
}
