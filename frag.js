const frag = `precision mediump float;

varying vec2 fragTexCoord;

uniform sampler2D smp;

void main() {
  vec4 texel = texture2D(smp, fragTexCoord);
  gl_FragColor = vec4(texel.rgb * texel.a, texel.a);
}`;
