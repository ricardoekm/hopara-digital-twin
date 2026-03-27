export default `\
#define SHADER_NAME arc-layer-fragment-shader

precision highp float;
uniform bool antialiasing;

varying vec4 vFillColor;
varying vec2 unitPosition;
varying float innerUnitRadius;
varying float instanceOuterRadiusPixels;
varying float startAngle;
varying float endAngle;

float HPI = 1.5707963269;
float PI = 3.1415926538;
float PI2 = 6.2831853076;

float nsin(float t, float from, float to){
    return ((sin(t) + 1.0) / 2.0) * (to - from) + from;
}

void main(void) {
  float s = startAngle;
  float e = endAngle;
  float start = mod(s / (2.0 * PI), 1.0);
  float end = mod(e / (2.0 * PI), 1.0);
  
  if(s > e){
    start = mod(e / (2.0 * PI), 1.0);
    end = mod(s / (2.0 * PI), 1.0);
  } 
  geometry.uv = unitPosition;
  vec2 nuv = normalize(unitPosition);
  vec2 up = normalize(vec2(instanceOuterRadiusPixels, 0.0));
  float _dot = up.x*nuv.x + up.y*nuv.y;
  float _det = up.x*nuv.y - up.y*nuv.x;
  float angle = atan(_dot, _det);
  if(angle < 0.0) angle = PI + (PI + angle);
  angle /= PI2;

  float distToCenter = length(unitPosition) * instanceOuterRadiusPixels;
  float inCircle = antialiasing ? 
    smoothedge(distToCenter, instanceOuterRadiusPixels) : 
    step(distToCenter, instanceOuterRadiusPixels);


  float isLine = antialiasing ? 
  smoothedge(innerUnitRadius * instanceOuterRadiusPixels, distToCenter) :
  step(innerUnitRadius * instanceOuterRadiusPixels, distToCenter);

  if(inCircle == 0.0 || isLine == 0.0 || angle < start || angle > end){
    discard;
  }

  gl_FragColor = vec4(vFillColor.rgb, vFillColor.a * isLine * inCircle);
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`
