precision highp float;

uniform vec3 iResolution;
uniform float	iTime;
uniform float	iTimeDelta;
uniform int	iFrame;
uniform vec4 iMouse;

uniform sampler2D iChannel0;

varying vec2 uv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

vec2 nodeWarp(vec2 node, vec2 uv, float scale) {
  float hight = min(node.x, node.y);
  float dist = distance(node, uv);
  vec2 uv2 = uv * (1.0-scale) + scale;// - panDelta;
  vec2 uv3 = uv2 - (vec2(dist)*scale);
  return uv3;
}

void main() {
  float t = iTime/10000.;
  vec2 node = vec2(snoise3(vec3(uv.xy, t)), snoise3(vec3(t, uv.yx))) + 0.5;
  vec2 uv2 = nodeWarp(node, uv, 0.2);
  vec4 color = texture2D(iChannel0, uv2);

  float d = abs(distance(node, uv));

  vec4 slick = color;

  if(d < 0.05) {
    slick.b = slick.b + 0.5 - d*5.;
  } 
  if (d > 0.01 && d < 0.07) {
    slick.g = slick.g - 0.1 + d*5.;
  } 
  if (d > 0.07 && d < 0.13) {
    slick.g = slick.g + 0.7 - d*5.;
  } 
  if (d > 0.13 && d < 0.17) {
    slick.r = slick.r - 0.1 + d*2.;
  }

	gl_FragColor = slick;
}
