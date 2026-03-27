export default `\
#define SHADER_NAME scatterplot-layer-vertex-shader

attribute vec3 positions;

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute float instanceRadius;
attribute float instanceLineWidths;
attribute vec4 instanceFillColors;
attribute vec4 instanceLineColors;
attribute vec3 instancePickingColors;

uniform float opacity;
uniform float radiusScale;
uniform float radiusMinPixels;
uniform float radiusMaxPixels;
uniform float lineWidthScale;
uniform float lineWidthMinPixels;
uniform float lineWidthMaxPixels;
uniform float stroked;
uniform bool filled;
uniform bool antialiasing;
uniform bool billboard;
uniform int radiusUnits;
uniform int lineWidthUnits;
uniform float outerShadow;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying vec2 unitPosition;
varying float innerUnitRadius;
varying float outerRadiusPixels;


void main(void) {
  geometry.worldPosition = instancePositions;

  // Multiply out radius and clamp to limits
  outerRadiusPixels = clamp(
    project_size_to_pixel(radiusScale * instanceRadius, radiusUnits),
    radiusMinPixels, radiusMaxPixels
  );
  
  // Multiply out line width and clamp to limits
  float lineWidthPixels = clamp(
    project_size_to_pixel(lineWidthScale * instanceLineWidths, lineWidthUnits),
    lineWidthMinPixels, lineWidthMaxPixels
  );

  // outer radius needs to offset by half stroke width
  outerRadiusPixels += stroked * lineWidthPixels / 2.0;

  // Expand geometry to accomodate edge smoothing
  float edgePadding = antialiasing ? (outerRadiusPixels + SMOOTH_EDGE_RADIUS) / outerRadiusPixels : 1.0;
  if(outerShadow > 0.1) {
    edgePadding *= (1.0 + outerShadow);
  }

  // position on the containing square in [-1, 1] space
  unitPosition = edgePadding * positions.xy;
  geometry.uv = unitPosition;
  geometry.pickingColor = instancePickingColors;

  innerUnitRadius = 1.0 - stroked * lineWidthPixels / outerRadiusPixels;
  
  if (billboard) {
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
    vec3 offset = edgePadding * positions * outerRadiusPixels;
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position.xy += project_pixel_size_to_clipspace(offset.xy);
  } else {
    vec3 offset = edgePadding * positions * project_pixel_size(outerRadiusPixels);
    DECKGL_FILTER_SIZE(offset, geometry);
    gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, offset, geometry.position);
    DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  }

  // Apply opacity to instance color, or return instance picking color
  vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * opacity);
  DECKGL_FILTER_COLOR(vFillColor, geometry);
  vLineColor = vec4(instanceLineColors.rgb, instanceLineColors.a * opacity);
  DECKGL_FILTER_COLOR(vLineColor, geometry);
}
`
