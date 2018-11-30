vec4 projection_matrix(vec2 pos) {
  return vec4(pos, 0, 1);
}

#pragma glslify: export(projection_matrix)
