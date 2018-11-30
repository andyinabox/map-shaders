vec4 texture(sampler2D tex, vec2 uv) {
  return texture2D(tex, uv);
}

#pragma glslify: export(texture)
