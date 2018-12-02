precision highp float;

// https://www.shadertoy.com/view/4slGRM
// Simple Water shader. (c) Victor Korsun, bitekas@gmail.com; 2012.
//
// Attribution-ShareAlike CC License.

// offset determines how much warping there will be
// #define offset 0.1
// slow down rotation by dividing by larger value
// #define speed 1000.0

uniform vec3 iResolution;
uniform float	iTime;
uniform float	iTimeDelta;
uniform int	iFrame;
uniform vec4 iMouse;

uniform sampler2D iChannel0;

varying vec2 uv;

const float PI = 3.1415926535897932;

#pragma glslify: map = require(glsl-map)

// play with these parameters to custimize the effect
// ===================================================

//speed
const float speed = 0.2;
const float speed_x = 0.3;
const float speed_y = 0.3;

// refraction
const float emboss = 0.50;
const float intensity = 2.4;
const int steps = 8;
const float frequency = 6.0;
const int angle = 7; // better when a prime

// reflection
const float delta = 60.;
const float intence = 700.;

const float reflectionCutOff = 0.012;
const float reflectionIntence = 200000.;

// ===================================================


float col(vec2 coord,float time) {
  float delta_theta = 2.0 * PI / float(angle);
  float col = 0.0;
  float theta = 0.0;
  for (int i = 0; i < steps; i++) {
    vec2 adjc = coord;
    theta = delta_theta*float(i);
    adjc.x += cos(theta)*time*speed + time * speed_x;
    adjc.y -= sin(theta)*time*speed - time * speed_y;
    col = col + cos( (adjc.x*cos(theta) - adjc.y*sin(theta))*frequency)*intensity;
  }
  return cos(col);
}

//---------- main

void main() {
  float time = iTime*1.3;

  vec2 p = uv;//(fragCoord.xy) / iResolution.xy;
  // vec2 p = (gl_FragCoord.xy) / iResolution.xy;
  vec2 c1 = p;
  vec2 c2 = p;
  float cc1 = col(c1,time);
  //
  // c2.x += iResolution.x/delta;
  float dx = emboss*(cc1-col(c2,time))/delta;
  //
  c2.x = p.x;
  // c2.y += iResolution.y/delta;
  float dy = emboss*(cc1-col(c2,time))/delta;
  //
  c1.x += dx*2.;
  c1.y = -(c1.y+dy*2.);
  //
  float alpha = 1.+dot(dx,dy)*intence;
  //
  // float ddx = dx - reflectionCutOff;
  // float ddy = dy - reflectionCutOff;
  // if (ddx > 0. && ddy > 0.)
  // alpha = pow(alpha, ddx*ddy*reflectionIntence);

  vec4 col = texture2D(iChannel0,c1)*(alpha);
  // vec4 col = texture2D(iChannel0,uv);

  gl_FragColor = col;
}
