export default `\
precision highp float;
varying vec2 vWorld;
varying float vLineWidthWorld;
varying float vAABandWorld;

uniform float uSize;
uniform vec4  uStrokeColor;
uniform float uOpacity;
uniform float uAngle;
uniform vec2  uAnchor;

float gridDistUnitsTwoAngles(vec2 worldUnits, float stepUnits, float angleA, float angleB) {
  vec2 m = worldUnits;
  vec2 origin = uAnchor;
  m -= origin;

  float ca = cos(angleA), sa = sin(angleA);
  float cb = cos(angleB), sb = sin(angleB);
  vec2 dirA = vec2(ca, sa);
  vec2 dirB = vec2(cb, sb);

  float sA = dot(m, dirA);
  float sB = dot(m, dirB);
  float mxA = mod(sA, stepUnits);
  float mxB = mod(sB, stepUnits);
  float dA = min(mxA, stepUnits - mxA);
  float dB = min(mxB, stepUnits - mxB);
  return min(dA, dB);
}

void main(void) {
  float ang = 90.0 - uAngle;
  float ang2 = uAngle == 0.0 || uAngle == 90.0 ? uAngle : 90.0 + uAngle;
  float d = gridDistUnitsTwoAngles(vWorld, uSize, radians(ang), radians(ang2));

  float halfWidthWorld = 0.5 * vLineWidthWorld;
  float alphaLine = 1.0 - smoothstep(halfWidthWorld - vAABandWorld, halfWidthWorld + vAABandWorld, d);

  vec4 col = vec4(uStrokeColor.rgb, uStrokeColor.a * uOpacity * alphaLine);
  if (col.a < 0.001) discard;
  gl_FragColor = col;
}
`
