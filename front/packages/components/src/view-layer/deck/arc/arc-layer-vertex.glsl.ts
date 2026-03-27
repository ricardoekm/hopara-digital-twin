export default `\
#define SHADER_NAME arc-layer-vertex-shader

attribute vec3 positions;

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute float instanceInnerRadius;
attribute float instanceOuterRadius;
attribute float instanceLineWidths;
attribute vec4 instanceFillColors;
attribute float instanceStartAngles;
attribute float instanceEndAngles;
attribute vec3 instancePickingColors;

uniform float opacity;
uniform bool antialiasing;
uniform bool billboard;
uniform int radiusUnits;

varying vec4 vFillColor;
varying vec2 unitPosition;
varying float innerUnitRadius;
varying float instanceOuterRadiusPixels;
varying float instanceInnerRadiusPixels;
varying float startAngle;
varying float endAngle;

float PI2 = 6.283185;

void main(void) {
  startAngle = min(instanceStartAngles, PI2);
  endAngle = instanceEndAngles;
  instanceOuterRadiusPixels = project_size_to_pixel(instanceOuterRadius, UNIT_COMMON);
  instanceInnerRadiusPixels = project_size_to_pixel(instanceInnerRadius, radiusUnits);
  geometry.worldPosition = instancePositions;
  float lineWidthPixels = instanceOuterRadiusPixels - instanceInnerRadiusPixels;
  float edgePadding = antialiasing ? (instanceOuterRadiusPixels + SMOOTH_EDGE_RADIUS) / instanceOuterRadiusPixels : 1.0;

  unitPosition = edgePadding * positions.xy;
  geometry.uv = unitPosition;
  geometry.pickingColor = instancePickingColors;
  innerUnitRadius = 1.0 - lineWidthPixels / instanceOuterRadiusPixels;
  
  if (billboard) {
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
    vec3 offset = edgePadding * positions * instanceOuterRadiusPixels;
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);
  } else {
    vec3 offset = edgePadding * positions * project_pixel_size(instanceOuterRadiusPixels);
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset, geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  }

  // Apply opacity to instance color, or return instance picking color
  vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * opacity);
  DECKGL_FILTER_COLOR(vFillColor, geometry);
}
`
