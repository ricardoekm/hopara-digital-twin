// In GeoJSON layers we have only the GeoJson in the callbacks (e.g. hover).
// We need the full row for tooltip and coloring
// Row translators translates the inner field (e.g. geojson) to the full row
export interface RowTranslator {
  translate(value:Object, index?: number): any
}
