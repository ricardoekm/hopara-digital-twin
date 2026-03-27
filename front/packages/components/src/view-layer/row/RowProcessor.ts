import {Columns, Row, Rows, Z_INDEX_COLUMN_NAME} from '@hopara/dataset'
import {filterPlacedRows} from './RowVisibility'
import {memoize} from '@hopara/memoize'
import ViewState from '../../view-state/ViewState'
import {World} from '../../world/World'
import {Visible} from '../LayerFactory'
import {RowProjector} from '@hopara/projector'
import {RowProcessingTransform} from '../../transform/RowProcessingTransform'
import { Snapper, Transform } from '@hopara/encoding'
import { filter, isNil } from 'lodash/fp'
import { RowEdit, RowEditType } from '../deck/interaction/RowEdit'
import { Coordinates, RowCoordinates, toPolygon } from '@hopara/spatial'
import { geometricFromViewport } from '../../geometric/GeometricFactory'

const cacheStore = new Map()

export type RowProcessorProps = {
  rows: Rows
  transform?: Transform
  lastModified?: Date
  visible?: Visible
  columns: Columns
  filterPlaced?: boolean
  snap?: boolean
}

export class RowProcessor {
  viewState?: ViewState
  world?: World
  rowProjector?: RowProjector
  rowEdit?: RowEdit

  constructor(viewState?: ViewState, world?: World, rowProjector?: RowProjector, rowEdit?: RowEdit) {
    this.viewState = viewState
    this.world = world
    this.rowProjector = rowProjector
    this.rowEdit = rowEdit
  }

  private applyTransforms(transform: RowProcessingTransform, columns: Columns, rows: Rows) {
    if (!this.viewState || !this.world) {
      return rows
    }

    const transformedRows = transform.apply(rows, columns, this.viewState)
    transformedRows.setEtag(rows.getEtag())
    return transformedRows
  }

  private getZoomTransformEtagSuffix(currentTransform: string) {
    const zoomKey = this.viewState?.zoom ? Math.floor((this.viewState.zoom as any * 10) / 5) : 0
    return `${currentTransform}#${zoomKey}`
  }

  private getProjectEtagSuffix() {
    if (!this.rowProjector) return ''
    const dimensions = this.viewState?.getDimensions()
    return '' + dimensions?.height + dimensions?.width
  }

  private getBaseEtag(lastModified?: Date) {
    return `${this.getProjectEtagSuffix()}#${lastModified?.getTime() ?? 0}`
  }

  private getEtagModifier(transform?: Transform, lastModified?: Date, visible?: boolean) {
    let etag = this.getBaseEtag(lastModified)
    if (transform && visible && transform.isZoomBased()) {
      etag += this.getZoomTransformEtagSuffix(transform.type)
    } else if (transform) {
      // If not visible we'll not consider the zoom on the cache key
      // to not reprocess the transform in invisible zoom ranges
      // Save transform processing time that won't have effect
      etag += transform.type
    }
    return etag
  }

  private projectRows(rows) {
    return this.rowProjector!.projectRows(rows)
  }

  private translate(rowCoordinates: RowCoordinates, newCoordinates: [number, number, number?]) {
    const geometric = geometricFromViewport(this.viewState!.getViewport())
    const polygon = toPolygon(rowCoordinates.getGeometryLike())
    const coords = geometric.translateToCoordinates(polygon, newCoordinates as any)
    return coords
  }

  private snapTranslate(row: Row, rows: Rows): Row {
    // To not mess with room placement
    if (row.getCoordinates().isGeometryLike() && this.world?.isWebmercatorProjection()) {
      return row
    }

    const snapper = new Snapper(5)

    const rowsButSelf = rows.filter((r) => r._id !== row._id)
    const visibileWorld = this.viewState?.getVisibleWorld()
    const projectedCoordinates = filter((r) => this.viewState!.isRowInRange(r.getCoordinates(), visibileWorld), rowsButSelf)
                                 .map((r) => r.getCoordinates().toCoordinates(), rowsButSelf)
                                 .map((c) => Coordinates.fromArray(this.viewState!.projectCoordinate(c)))
    const projectedCoordinate = Coordinates.fromArray(this.viewState!.projectCoordinate(row.getCoordinates().toCoordinates()))
    const snap = snapper.snap(projectedCoordinate, projectedCoordinates)
    if (!snap) {
      return row
    }

    const newCoordinates = this.viewState!.unprojectCoordinate(snap.coordinates)
    const snapReferenceCoordinates = this.viewState!.unprojectCoordinate(snap.reference)
    let rowCoordinates: RowCoordinates
    
    if (row.getCoordinates().isGeometryLike()) {
      rowCoordinates = RowCoordinates.fromGeometry(this.translate(row.getCoordinates(), newCoordinates))
    } else {
      rowCoordinates = RowCoordinates.fromArray(newCoordinates)
    }

    return row.updateCoordinates(rowCoordinates.setSnapReference(Coordinates.fromArray(snapReferenceCoordinates)))
  }

  private snap(rowEdit: RowEdit, rows: Rows) {
    if (rowEdit.editType === RowEditType.TRANSLATE) return this.snapTranslate(rowEdit.row, rows)
    return rowEdit.row
  }

  doProcessRows(props: RowProcessorProps): Rows {
    let rows = props.rows?.clone() ?? new Rows()
    if (props.filterPlaced !== false && !props.transform?.isRowPlacing()) {
      rows = filterPlacedRows(rows)
    }

    if (props.transform && props.columns && props.transform.isRowProcessing()) {
      rows = this.applyTransforms(props.transform as RowProcessingTransform, props.columns, rows)
      rows.columns = props.columns
    }

    if ( props.transform?.isRowPlacing() ) {
      // If for some reason the place transform didn't work we'll clean it up here
      rows = filterPlacedRows(rows)
    }

    if (this.rowProjector) {
      rows = this.projectRows(rows)
    }

    rows.updateEtagModifier('rowProcessor', this.getEtagModifier(props.transform, props.lastModified, props.visible?.value))
    if ( this.world?.isCartesianProjection()) {
      // Reversing the order in vega mess with the index callback and axis
      return rows
    } else {
      return rows.sortByColumn(Z_INDEX_COLUMN_NAME) 
    }
  }

  updateEditingRow(rows: Rows, snap = true) {
    if (!this.rowEdit?.row) return rows
    
    // const newRows = rows.clone()
    const newRows = rows // small risk for performance

    if (this.rowEdit?.row) {
      const rowIndex = newRows.findIndex((row) => row._id === this.rowEdit!.row._id)
      if (rowIndex >= 0) {
        newRows[rowIndex] = snap ? this.snap(this.rowEdit, newRows) : this.rowEdit.row
      }
    }

    return newRows
  }

  getCacheKey(rows: Rows, transform?: Transform, lastModified?: Date, visible?: Visible, filterPlaced?: boolean) {
    const etag = rows.getEtag().clone()

    if (!isNil(filterPlaced)) {
      etag.updateModifier('filterPlaced', filterPlaced.toString())
    }

    etag.updateModifier('rowProcessor', this.getEtagModifier(transform, lastModified, visible?.value))
    return etag.getValue()
  }

  processRows(props: RowProcessorProps): Rows {
    const cacheKey = this.getCacheKey(props.rows, props.transform, props.lastModified, props.visible, props.filterPlaced)
    const cachedProcessRows = memoize(this.doProcessRows.bind(this), {cacheKey, cacheStore})
    const processedRows = cachedProcessRows(props)
    return this.updateEditingRow(processedRows, props.snap)
  }
}
