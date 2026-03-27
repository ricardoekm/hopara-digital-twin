export default `\
#define SHADER_NAME cube-layer-vertex-shader

attribute vec3 positions;
attribute vec3 normals;

attribute vec3 instancePositions;
attribute vec3 instancePositions64Low;
attribute float instanceAnchors;
attribute vec3 instanceSizes;
attribute vec4 instanceFillColors;
attribute float instanceLineWidths;
attribute vec4 instanceLineColors;
attribute vec3 instancePickingColors;

// Custom uniforms
uniform vec3 sizeMinPixels;
uniform vec3 sizeMaxPixels;
uniform int sizeUnits;
uniform int lineWidthUnits;
uniform float stroked;
uniform float opacity;
uniform float withPadding;
uniform float paddingSize;
uniform int paddingRelativeToSize;

varying vec3 outerSizePixels;
varying vec3 innerSizePixels;
varying float lineWidthPixels;
varying vec4 vFillColor;
varying vec4 vLineColor;
varying vec2 unitPosition;

// Result
varying vec4 vColor;

void main(void) {
  geometry.worldPosition = instancePositions;

  // TODO: use uniform
  float sizeScale = 1.0;

  float outerXSizePixels = clamp(project_size_to_pixel(instanceSizes.x / 2.0, sizeUnits), sizeMinPixels.x / 2.0, sizeMaxPixels.x / 2.0);
  float outerYSizePixels = clamp(project_size_to_pixel(instanceSizes.y / 2.0, sizeUnits), sizeMinPixels.y / 2.0, sizeMaxPixels.y / 2.0);
  float outerZSizePixels = clamp(project_size_to_pixel(instanceSizes.z / 2.0, sizeUnits), sizeMinPixels.z / 2.0, sizeMaxPixels.z / 2.0);

  outerSizePixels = vec3(outerXSizePixels, outerYSizePixels, outerZSizePixels);
  lineWidthPixels = project_size_to_pixel(instanceLineWidths, lineWidthUnits);
  
  vec2 paddingSizePixels = vec2(paddingSize);
  if (withPadding != 0.0 && paddingRelativeToSize == 1) {
    float paddingScale = paddingSize / 100.0;
    paddingSizePixels = vec2(outerXSizePixels * paddingScale, outerYSizePixels * paddingScale);
  }

  float paddingSize = withPadding * (1.0 + paddingSizePixels.x / outerXSizePixels);
  if (paddingSize > 1.0) {
    outerSizePixels *= paddingSize;
  }

  float borderSize = stroked * (1.0 + lineWidthPixels / outerXSizePixels);
  if (borderSize > 1.0) {
    outerSizePixels *= borderSize;
  }

  innerSizePixels = 1.0 - stroked * lineWidthPixels / outerSizePixels;
  
  // position on the containing square in [-1, 1] space
  unitPosition = positions.xy;
  geometry.uv = unitPosition;
  geometry.pickingColor = instancePickingColors;

  vec3 pixelOffset = positions * outerSizePixels;
  pixelOffset.x += (outerSizePixels.x - (paddingSizePixels.x + lineWidthPixels)) * instanceAnchors;
  pixelOffset.y *= -1.0;

  gl_Position = project_position_to_clipspace(instancePositions, instancePositions64Low, vec3(0.0), geometry.position);
  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
  DECKGL_FILTER_SIZE(pixelOffset, geometry);
  gl_Position.xy += project_pixel_size_to_clipspace(pixelOffset.xy);

  // Apply opacity to instance color, or return instance picking color
  vFillColor = vec4(instanceFillColors.rgb, instanceFillColors.a * opacity);
  DECKGL_FILTER_COLOR(vFillColor, geometry);
  vLineColor = vec4(instanceLineColors.rgb, instanceLineColors.a);
  DECKGL_FILTER_COLOR(vLineColor, geometry);
}
`
