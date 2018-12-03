precision highp float;

uniform vec3 iResolution;
uniform float	iTime;
uniform float	iTimeDelta;
uniform int	iFrame;
uniform vec4 iMouse;

uniform sampler2D iChannel0;

varying vec2 uv;

#pragma glslify: map = require(glsl-map)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

vec2 nodeWarp(vec2 node, vec2 uv, float offset) {
  float hight = min(node.x, node.y);
  float dist = distance(node, uv);
  vec2 uv2 = uv * (1.0-offset) + offset;
  vec2 uv3 = uv2 - (vec2(dist)*offset);
  return uv3;
}

void main() {
  // vec4 color = texture2D(iChannel0, uv);

  // this will move in a circle between (-1, -1) and (1, 1)
  // vec2 node = vec2(cos(iTime/speed), sin(iTime/speed));
  // // map that circle to fit into (0, 0) and (1, 1)
  // vec2 node2 = map(node, vec2(-1.0), vec2(1.0), vec2(0.0), vec2(1.0));
  // // find the distance between the rotating node and current coordinates
  // float dist = distance(node2, uv);
  // // this will essentially scale up `offset` so that
  // // we don't see distorded edges when we apply the offset
  // vec2 uv2 = uv * (1.-offset) + offset;
  // // apply offset based on distance from node
  // vec2 uv3 = uv2 - (vec2(dist)*offset);
  float time1 = iTime/3000.; //sin(iTime/500.);
  float time2 = iTime/3000.; //cos(iTime/500.);
  vec2 node1 = vec2(snoise2(vec2(time1, time2)), snoise2(vec2(time2, time1)));
  vec2 node2 = vec2(snoise2(vec2(time2, time1)), snoise2(vec2(time1, time2)));
  vec2 node3 = vec2(snoise2(vec2(-time1, time2)), snoise2(vec2(-time2, time1)));
  vec2 uvWave = (nodeWarp(node1, uv, 0.07) + nodeWarp(node2, uv, 0.07) + nodeWarp(node3, uv, 0.07)) / 3.;

  vec4 color = texture2D(iChannel0, uvWave);;

  // float max1 = max(distance(node1, uv), distance(node2, uv));
  // float max2 = max(distance(node2, uv), distance(node3, uv));
  // float max3 = max(distance(node3, uv), distance(node1, uv));
  // float distMax = max(max(max1, max2), max(max2, max3));

  float dist = abs(distance(uvWave, uv));

  // if(dist > 0.1 && dist < 0.9) {
    color.rgb = color.rgb + sqrt(dist);
  // }
  

	gl_FragColor = color;
}
