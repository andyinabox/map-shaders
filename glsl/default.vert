attribute vec2 position;
varying vec2 uv;

#pragma glslify: projection_matrix = require(./utils/projection-matrix)
#pragma glslify: texture_coordinates = require(./utils/texture-coordinates)

void main() {
  gl_Position = projection_matrix(position);
  uv = texture_coordinates(position);
}