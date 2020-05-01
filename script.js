/** @type {HTMLCanvasElement} */
const canv = document.getElementById('canv');

/** @type {WebGLRenderingContext} */
const gl = canv.getContext('webgl');

const fullscreenQuad = [
  -1, 1, 0, 1,
  -1, -1, 0, 0,
  1, 1, 1, 1,
  -1, -1, 0, 0,
  1, -1, 1, 0,
  1, 1, 1, 1
];

const screenQuad = [
  -0.435, 0.46, 0, 1,
  -0.433, -0.213, 0, 0,
  0.14, 0.37, 1, 1,
  0.128, -0.245, 1, 0,
  -0.433, -0.213, 0, 0,
  0.14, 0.37, 1, 1,
];

const fgImage = new Image();
fgImage.src = 'fg.png';

const screenImage = new Image();
screenImage.src = 'screen.png';

let vertexShader = gl.createShader(gl.VERTEX_SHADER);
let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vertexShader, vert);
gl.shaderSource(fragmentShader, frag);
gl.compileShader(vertexShader);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

const screenTex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, screenTex);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

const fgTex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, fgTex);
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

const vertAttrib = gl.getAttribLocation(program, 'vertPosition');
const texAttrib = gl.getAttribLocation(program, 'vertTexCoord');

const vertBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);

gl.vertexAttribPointer(
  vertAttrib,
  2,
  gl.FLOAT,
  false,
  4 * Float32Array.BYTES_PER_ELEMENT,
  0
);
gl.enableVertexAttribArray(vertAttrib);

gl.vertexAttribPointer(
  texAttrib,
  2,
  gl.FLOAT,
  false,
  4 * Float32Array.BYTES_PER_ELEMENT,
  2 * Float32Array.BYTES_PER_ELEMENT
);
gl.enableVertexAttribArray(texAttrib);

let imagesLoaded = 0;

fgImage.onload = () => {
  gl.bindTexture(gl.TEXTURE_2D, fgTex);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0, gl.RGBA, gl.RGBA,
    gl.UNSIGNED_BYTE,
    fgImage
  );
  if (++imagesLoaded === 2) init();
};

screenImage.onload = () => {
  if (++imagesLoaded === 2)  init();
};

function init() {
  document.getElementById('loading').style.display = 'none';
  render(screenImage);
}

function render(screenImage) {
  gl.bindTexture(gl.TEXTURE_2D, screenTex);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0, gl.RGBA, gl.RGBA,
    gl.UNSIGNED_BYTE,
    screenImage
  );
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(screenQuad), gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.bindTexture(gl.TEXTURE_2D, fgTex);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(fullscreenQuad), gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

const reader = new FileReader();

document.getElementById('file').onchange = function() {
  const imgFile = this.files[0];
  this.value = null;
  reader.readAsDataURL(imgFile);
};

reader.onload = () => {
  const newImg = new Image();
  newImg.src = reader.result;
  newImg.onload = () => render(newImg);
};
