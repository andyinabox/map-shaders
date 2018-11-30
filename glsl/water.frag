precision highp float;

#define amp 0.5


uniform vec3 iResolution;
uniform float	iTime;
uniform float	iTimeDelta;
uniform int	iFrame;
uniform vec4 iMouse;

uniform sampler2D iChannel0;

varying vec2 uv;

void main() { 
  vec4 color = texture2D(iChannel0, uv);
  vec2 distortedUv = uv + vec2(color.x*sin(iTime/500.), color.y*cos(iTime/500.))*.01;
    
	gl_FragColor = texture2D(iChannel0, distortedUv);
}