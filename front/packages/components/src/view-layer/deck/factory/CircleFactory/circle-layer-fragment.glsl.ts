export default `\
#define SHADER_NAME scatterplot-layer-fragment-shader

precision highp float;

uniform bool filled;
uniform float stroked;
uniform bool antialiasing;
uniform bool innerShadow;
uniform float outerShadow;

varying vec4 vFillColor;
varying vec4 vLineColor;
varying vec2 unitPosition;
varying float innerUnitRadius;
varying float outerRadiusPixels;

void main(void) {
  geometry.uv = unitPosition;
  
  float outerShadowRadiusPixels = outerRadiusPixels * (1.0 + outerShadow);

  float distToCenter = length(unitPosition) * outerRadiusPixels;
  
  float inCircle = antialiasing ? 
    smoothedge(distToCenter, outerRadiusPixels) : 
    step(distToCenter, outerRadiusPixels);
    
  float inShadow = antialiasing ? 
    smoothedge(distToCenter, outerShadowRadiusPixels) : 
    step(distToCenter, outerShadowRadiusPixels);

  if (inCircle == 0.0 && inShadow == 0.0) {
    discard;
  }

  if (stroked > 0.5) {
    float isLine = antialiasing ? 
      smoothedge(innerUnitRadius * outerRadiusPixels, distToCenter) :
      step(innerUnitRadius * outerRadiusPixels, distToCenter);

    if (filled) {
      gl_FragColor = mix(vFillColor, vLineColor, isLine);
    } else {
      if (isLine == 0.0) {
        discard;
      }
      gl_FragColor = vec4(vLineColor.rgb, vLineColor.a * isLine);
    }
  } else if (!filled) {
    discard;
  } else {
    gl_FragColor = vFillColor;
  }
  
  float degradeArea = outerRadiusPixels * 0.5;
  float darkenAmount = 0.1;
  
  gl_FragColor.a *= inCircle;
  
  if(innerShadow) {
    if(distToCenter > degradeArea) {
      float w = 1.0 - ((distToCenter - degradeArea) / (outerRadiusPixels - degradeArea)) * darkenAmount;
      gl_FragColor = vec4(gl_FragColor.rgb * w, gl_FragColor.a);
    }
  } else if (outerShadow > 0.0) {
    if(distToCenter > outerRadiusPixels && distToCenter < outerShadowRadiusPixels) {
      float darkenAmount = 0.1;
      float w = ((outerShadowRadiusPixels - distToCenter) / (outerShadowRadiusPixels - outerRadiusPixels)) * darkenAmount;
      if(gl_FragColor.a > 0.0) {
       gl_FragColor = vec4(mix(gl_FragColor.rgb, vec3(0.0), w), gl_FragColor.a + w);
      } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, w);
      }
    }
  }
  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`
