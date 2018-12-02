precision highp float;

// offset determines how much warping there will be
#define offset 0.1
// slow down rotation by dividing by larger value
#define speed 1000.0

uniform vec3 iResolution;
uniform float	iTime;
uniform float	iTimeDelta;
uniform int	iFrame;
uniform vec4 iMouse;

uniform sampler2D iChannel0;

varying vec2 uv;

#pragma glslify: map = require(glsl-map)

void main() {
  vec4 color = texture2D(iChannel0, uv);

  // this will move in a circle between (-1, -1) and (1, 1)
  vec2 node = vec2(cos(iTime/speed), sin(iTime/speed));
  // map that circle to fit into (0, 0) and (1, 1)
  vec2 node2 = map(node, vec2(-1.0), vec2(1.0), vec2(0.0), vec2(1.0));
  // find the distance between the rotating node and current coordinates
  float dist = distance(node2, uv);
  // this will essentially scale up `offset` so that
  // we don't see distorded edges when we apply the offset
  vec2 uv2 = uv * (1.-offset) + offset;
  // apply offset based on distance from node
  vec2 uv3 = uv2 - (vec2(dist)*offset);

	gl_FragColor = texture2D(iChannel0, uv3);
}
