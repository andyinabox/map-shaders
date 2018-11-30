precision highp float;

uniform vec3 iResolution;
uniform float	iTime;
uniform float	iTimeDelta;
uniform int	iFrame;
uniform vec4 iMouse;

uniform sampler2D iChannel0;

varying vec2 uv;

void main() { 
	gl_FragColor = texture2D(iChannel0, uv);
}