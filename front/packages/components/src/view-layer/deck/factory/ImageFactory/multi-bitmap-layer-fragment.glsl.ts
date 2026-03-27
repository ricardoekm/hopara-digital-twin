export default `\
#define SHADER_NAME multi-bitmap-layer-fragment-shader

precision highp float;

uniform sampler2D bitmapTexture;
uniform float desaturate;
uniform vec4 transparentColor;
uniform vec3 tintColor;
uniform float alphaCutoff;

varying vec2 vTexCoord;
varying float vOpacity;

void main(void) {
  vec4 bitmapColor = texture2D(bitmapTexture, vTexCoord);

  if (bitmapColor.a < alphaCutoff) {
    discard;
  }

  // Apply desaturation
  if (desaturate > 0.0) {
    float luminance = dot(bitmapColor.rgb, vec3(0.299, 0.587, 0.114));
    bitmapColor.rgb = mix(bitmapColor.rgb, vec3(luminance), desaturate);
  }

  // Apply tint
  bitmapColor.rgb = bitmapColor.rgb * tintColor;

  // Apply opacity
  bitmapColor.a *= vOpacity;

  gl_FragColor = bitmapColor;

  DECKGL_FILTER_COLOR(gl_FragColor, geometry);
}
`
