precision highp float;

uniform vec3 iResolution;
uniform float	iTime;
uniform float	iTimeDelta;
uniform int	iFrame;
uniform vec4 iMouse;

uniform sampler2D iChannel0;

varying vec2 uv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: map = require(glsl-map)

vec2 nodeWarp(vec2 node, vec2 uv, float scale) {
  float hight = min(node.x, node.y);
  float dist = distance(node, uv);
  vec2 uv2 = uv * (1.0-scale) + scale;// - panDelta;
  vec2 uv3 = uv2 - (vec2(dist)*scale);
  return uv3;
}

void main() {
  float t = iTime/10000.;
  float t2 = iTime/750.;
  vec4 color = texture2D(iChannel0, uv);
  float avg = (color.r + color.g + color.b) / 3.;
  if(avg < 0.5) {
    color.rgb = vec3(0.1);
  }
  if(avg > 0.5) {
    color.rgb = vec3(0.9);
  }


  vec2 node = vec2(snoise3(vec3(uv.xy, t)), snoise3(vec3(t, uv.yx))) + 0.5;
  vec2 node2 = vec2(snoise3(vec3(t, uv.xy)), snoise3(vec3(uv.yx, t))) + 0.5;
  vec2 uv2 = nodeWarp(node, vec2(map(sin(t), -1., 1., 0.0, 1.0)), 0.1);
  vec2 uv3 = nodeWarp(node2, uv, 0.1);
  uv2.xy = clamp(uv2.xy + vec2(color.r, color.g)*10., vec2(0.0), vec2(5.0)) - 0.6;

  vec2 uv4 = mix(uv2, uv3, 0.8);
  vec4 color1 = texture2D(iChannel0, uv4);

  float d = abs(distance(node, uv));
  float edge = snoise3(vec3(uv3.y, uv4.yx*10.));
  vec4 color2 = color1;

  if(d < edge) {
    color2.rgb = mix(color2.grb, vec3(sin(color2.b*t2), cos(color2.g*t2), tan(color2.r*t2)), sin(t));
  } 


  // vec4 color2 = texture2D(iChannel0, uv3);

  // float d = abs(distance(node, uv));

  // vec4 slick = color;

  // if(d < 0.05) {
  //   slick.b = slick.b + 0.5 - d*5.;
  // } 
  // if (d > 0.01 && d < 0.07) {
  //   slick.g = slick.g - 0.1 + d*5.;
  // } 
  // if (d > 0.07 && d < 0.13) {
  //   slick.g = slick.g + 0.7 - d*5.;
  // } 
  // if (d > 0.13 && d < 0.17) {
  //   slick.r = slick.r - 0.1 + d*2.;
  // }
  // color1.rgb = color1.rgb - 0.1;
	gl_FragColor = color2;
  // gl_FragColor = color;
}
