export default `\
#define SHADER_NAME grid-layer-vertex-shader

attribute vec2 positions;
uniform mat4 uWorldCoeffs;

uniform float uStrokeSize;
uniform int   uStrokeSizeUnit;

varying vec2 vWorld;
varying float vLineWidthWorld;
varying float vAABandWorld;


float toWorldUnits(float value, int units) {
  if (units == 2) {
    return max(0.001, value * project_pixel_size(1.0));
  } else {
    return max(0.001, value);
  }
}

void main(void) {
  vec2 uv = 0.5 * (positions + 1.0);
  vec4 xy = vec4(1.0, uv.x, uv.y, uv.x * uv.y);
  vec2 worldXY = vec2(
    dot(uWorldCoeffs[0], xy),  // linha 0 -> X
    dot(uWorldCoeffs[1], xy)   // linha 1 -> Y
  );
  vWorld = worldXY;

  float lineWidthWorldVS = toWorldUnits(uStrokeSize, uStrokeSizeUnit);
  float aaBandWorldVS = max(1e-6, project_pixel_size(1.0));
  vLineWidthWorld = lineWidthWorldVS;
  vAABandWorld    = aaBandWorldVS;

  geometry.worldPosition = vec3(vWorld, 0.0);
  geometry.uv = uv * 2.0 - 1.0;
  geometry.pickingColor = vec3(0.0);

  gl_Position = project_position_to_clipspace(geometry.worldPosition, vec3(0.0), vec3(0.0), geometry.position);
  DECKGL_FILTER_GL_POSITION(gl_Position, geometry);
}
`
