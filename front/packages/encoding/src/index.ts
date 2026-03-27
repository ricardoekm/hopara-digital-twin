export { getDiscreteSchemes, getContinuousSchemes } from './color/Schemes'

export {Encodings} from './Encodings'
export type {Encoding} from './Encoding'
export {EncodingScope} from './Encoding'
export {Data} from './data/Data'
export {DataRef} from './data/DataRef'
export type {Condition} from './condition/Condition'
export {testCondition} from './condition/Condition'
export {Snapper} from './position/Snapper'

// Position
export {PositionEncoding, PositionType} from './position/PositionEncoding'
export type {CoordinatesPositionEncoding} from './position/PositionEncoding'
export {PositionAccessorFactory} from './position/PositionAccessorFactory'
export {RotationEncoding} from './rotation/RotationEncoding'
export type {Transform} from './transform/Transform'
export {TransformType} from './transform/Transform'

// Color
export {ColorEncoding, ColorFormat, COLOR_MANAGED_FIELD} from './color/ColorEncoding'
export {ColorLiteralAccessor} from './color/accessor/ColorLiteralAccessor'
export {ColorFieldAccessor} from './color/accessor/ColorFieldAccessor'
export type {ColorScale} from './color/ColorEncoding'
export {getRgbScheme} from './color/Schemes'
export {getColorAccessor, getColumn, getColorAccessorInstance} from './color/accessor/ColorAccessor'
export {ColorScaleType} from './color/scale/ScaleType'
export type {RgbaColor} from './color/Colors'
export {WHITE_COLOR, RED_COLOR, GREEN_COLOR, BLUE_COLOR, TRANSPARENT_COLOR} from './color/Colors'

// Icon
export {IconEncoding} from './icon/IconEncoding'
export {IconAccessor} from './icon/IconAccessor'

// Config
export {EncodingConfig} from './config/EncodingConfig'

// Size
export {SizeEncoding, SizeUnits, SIZE_MANAGED_FIELD, REFERENCE_ZOOM_MANAGED_FIELD} from './size/SizeEncoding'
export type {SizeTranslator} from './size/SizeTranslator'  
export {NullSizeTranslator} from './size/NullSizeTranslator'
export {getSizeAccessor} from './size/accessor/SizeAccessor'
export {DeckSizeType} from './size/accessor/SizeAccessor'

// Map
export {MapEncoding} from './map/MapEncoding'
export {MapStyle} from './map/MapStyle'

// Text
export {TextEncoding, MaxLengthType} from './text/TextEncoding'

// Animation
export {AnimationEncoding, AnimationType} from './animation/AnimationEncoding'
export type {AnimationSpeed} from './animation/AnimationEncoding'

// Table
export type {TableEncoding, TableField} from './table/TableEncoding'

// Line
export {LineEncoding} from './line/LineEncoding'

// Polygon
export {PolygonEncoding} from './polygon/PolygonEncoding'

// Image
export {ImageEncoding, ImageResolution} from './image/ImageEncoding'
export {ViewEncoding, VIEW_MANAGED_FIELD, VIEW_DEFAULT_VALUE} from './image/ViewEncoding'

// Scale
export {PositionScaleType, getPositionScaleType} from './position/scale/ScaleType'
export type {PositionScales} from './position/scale/Scales'

// Model
export {ModelEncoding} from './model/ModelEncoding'
export {ModelAccessor} from './model/ModelAccessor'
