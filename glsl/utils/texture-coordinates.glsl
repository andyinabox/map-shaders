
vec2 texture_coordinates(vec2 pos) {
  return vec2(0.0,1.0)+vec2(0.5,-0.5) * (pos + 1.0);
}

#pragma glslify: export(texture_coordinates)
