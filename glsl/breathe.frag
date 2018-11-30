#pragma glslify: export(breathe)

precision highp float;

uniform vec3 iResolution;
uniform float	iTime;
uniform float	iTimeDelta;
uniform int	iFrame;
uniform vec4 iMouse;

uniform sampler2D iChannel0;

varying vec2 uv;

void main() { 
  vec2 center = vec2(0.5, 0.5);
  float d = distance(center, uv);
  vec4 color = texture2D(iChannel0, uv);
  vec2 newCoord = uv;
  newCoord.x = mix(uv.x, iMouse.x, abs(sin(float(iFrame)/100.))*0.05); // * sin(iFrame*d + 100.0);
  newCoord.y = mix(uv.y, iMouse.y, abs(sin(float(iFrame)/100.0))*0.05);
  vec4 color2 = texture2D(iChannel0, newCoord);
	gl_FragColor = color2;
}