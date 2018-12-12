precision highp float;

uniform vec3 iResolution;
uniform float	iTime;
uniform float	iTimeDelta;
uniform int	iFrame;
uniform vec4 iMouse;

uniform sampler2D iChannel0;

uniform vec3 mapCoordinates;
uniform vec2 deltaMapPixels;

varying vec2 uv;

#pragma glslify: snoise4 = require(glsl-noise/simplex/4d)
#pragma glslify: map = require(glsl-map)

#define amp 0.1

void main() {
  float perlin = snoise4(vec4(deltaMapPixels * .005, uv));
  vec2 uv2 = perlin * amp + uv;
  // uv2 = map(uv2, vec2(0.), vec2(2.), vec2(0.), vec2(1.));
  uv2 = uv2*0.8 + 0.1;
  vec4 color = texture2D(iChannel0, uv2);
  // vec4 color = vec4(vec3(perlin), 1.0);
	gl_FragColor = color;
}
