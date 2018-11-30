vec4 breathe(
  vec3 iResolution,
  float	iGlobalTime,
  float	iTimeDelta,
  float	iFrame,
  vec4 iMouse,
  sampler2D iChannel0,
  vec2 texCoord
) {
  vec2 center = vec2(0.5, 0.5);
  float d = distance(center, texCoord);
  vec4 color = texture2D(iChannel0, texCoord);
  vec2 newCoord = texCoord;
  newCoord.x = mix(texCoord.x, iMouse.x, abs(sin(iFrame/100.0))*0.05); // * sin(iFrame*d + 100.0);
  newCoord.y = mix(texCoord.y, iMouse.y, abs(sin(iFrame/100.0))*0.05);
  vec4 color2 = texture2D(iChannel0, newCoord);
  return color2;
}

#pragma glslify: export(breathe)
