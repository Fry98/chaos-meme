const vert = `precision mediump float;

attribute vec2 vertPosition;
attribute vec2 vertTexCoord;

varying vec2 fragTexCoord;

void main() {
  fragTexCoord = vertTexCoord;
  gl_Position = vec4(vertPosition, 0.0, 1.0);
}`;
