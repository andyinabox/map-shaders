import './styles.scss';
import mapboxgl from 'mapbox-gl';
// import tileGrabber from './tile-grabber';

import vertShader from './shader.vert';
import fragShader from './shader.frag';

console.log(vertShader, fragShader);

var shell = require("gl-now")()
shell.preventDefaults = false;

var createShader = require("gl-shader")
var createTexture = require("gl-texture2d")
var drawTriangle = require("a-big-triangle")
// var glslify = require("glslify")

// var createShader = glslify({
//   vertex: "\
//     attribute vec2 position;\
//     varying vec2 texCoord;\
//     void main() {\
//       gl_Position = vec4(position, 0, 1);\
//       texCoord = vec2(0.0,1.0)+vec2(0.5,-0.5) * (position + 1.0);\
//     }",
//   fragment: "\
//     precision highp float;\
//     uniform sampler2D texture;\
//     varying vec2 texCoord;\
//     void main() {\
//       gl_FragColor = texture2D(texture, texCoord);\
//     }",
//   inline: true
// })


const MAPBOX_API_TOKEN = "pk.eyJ1IjoiYW1kYXl0b24iLCJhIjoiY2pwMWNhejQ5MGE3dTNxcWcyZDVnMHcyciJ9.Zp_La2z0S0OTBEZm6QBaKQ";

mapboxgl.accessToken = MAPBOX_API_TOKEN;

const mapEl = document.createElement('div');
mapEl.id = 'map';
// mapEl.width = window.innerWidth;
// mapEl.height = window.innerHeight;
document.body.append(mapEl);

var lon = -93.282496;
var lat = 44.9998631;
var zoom = 15;

const map = new mapboxgl.Map({
  container: mapEl,
  style: 'mapbox://styles/mapbox/satellite-v9',
  // style: 'mapbox://mapbox.terrain-rgb',
  zoom: zoom,
  center: new mapboxgl.LngLat(lon ,lat)
});

// map.on('load', () => {
//   const mapCanvas = mapEl.querySelector('canvas');
//   console.log(mapCanvas);
//   const ctx = mapCanvas.getContext('webgl');
//   console.log(ctx);
// })


// class NullIslandLayer {
//   constructor() {
//     this.id = 'null-island';
//     this.type = 'custom';
//     this.renderingMode = '2d';
//   }

//   onAdd(map, gl) {
//     const vertexSource = `
//         uniform mat4 u_matrix;
//         void main() {
//             gl_Position = u_matrix * vec4(0.5, 0.5, 0.0, 1.0);
//             gl_PointSize = 20.0;
//         }`;

//     const fragmentSource = `
//         void main() {
//             gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//         }`;

//     const vertexShader = gl.createShader(gl.VERTEX_SHADER);
//     gl.shaderSource(vertexShader, vertexSource);
//     gl.compileShader(vertexShader);
//     const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
//     gl.shaderSource(fragmentShader, fragmentSource);
//     gl.compileShader(fragmentShader);

//     this.program = gl.createProgram();
//     gl.attachShader(this.program, vertexShader);
//     gl.attachShader(this.program, fragmentShader);
//     gl.linkProgram(this.program);
//   }

//   render(gl, matrix) {
//     gl.useProgram(this.program);
//     gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "u_matrix"), false, matrix);
//     gl.drawArrays(gl.POINTS, 0, 1);
//   }
// }

// map.on('load', function () {
//   map.addLayer(new NullIslandLayer());
// });


// const overlay = document.createElement('canvas');
// overlay.id = 'overlay';
// overlay.width = window.innerWidth;
// overlay.height = window.innerHeight;
// document.body.append(overlay);

// const tmpCanvas = document.createElement('canvas');

let shader;
let texture;
let mapCanvas;
let startTime;
let mouseDown = [null, null];

// events

document.addEventListener('mousedown', evt => mouseDown = [shell.mouseX, shell.mouseY]);
document.addEventListener('mouseup', evt => mouseDown = [null, null]);

shell.on("gl-init", function () {
  var gl = shell.gl
  startTime = (new Date()).getTime();
  //Create texture
  // texture = createTexture(gl, baboon)

  //Create shader
  // shader = createShader(gl)
  // shader.attributes.position.location = 0
})

shell.on('tick', (t) => {
  // update frame count
  // frame++;

  // rotate camera based on mouse
  // camera.rotate(
  //   [shell.mouseX / shell.width, shell.mouseY / shell.height],
  //   [shell.prevMouseX / shell.width, shell.prevMouseY / shell.height]
  // );
});

shell.on("gl-render", function (t) {

  //Draw it
  if(texture && shader) {
    texture.setPixels(mapCanvas);
    shader.bind()
    shader.uniforms.iChannel0 = texture.bind()
    shader.uniforms.iResolution = [shell.width, shell.height, 1.0];
    shader.uniforms.iTime = (new Date()).getTime() - startTime;
    shader.uniforms.iTimeDelta = t;
    shader.uniforms.iFrame = parseInt(shell.frameCount);
    shader.uniforms.iMouse = [shell.mouseX, shell.mouseY, mouseDown[0], mouseDown[1]];
  }
  drawTriangle(shell.gl)
})

map.on('load', function() {
  const gl = shell.gl;

  mapCanvas = mapEl.querySelector('.mapboxgl-canvas');
  texture = createTexture(gl, mapCanvas)
  shader = createShader(gl, vertShader, fragShader);
  // "\
  //   attribute vec2 position;\
  //   varying vec2 texCoord;\
  //   void main() {\
  //     gl_Position = vec4(position, 0, 1);\
  //     texCoord = vec2(0.0,1.0)+vec2(0.5,-0.5) * (position + 1.0);\
  //   }",
  // "\
  //   precision highp float;\
  //   uniform sampler2D texture;\
  //   varying vec2 texCoord;\
  //   void main() {\
  //     gl_FragColor = texture2D(texture, texCoord);\
  //   }"
  // );
  shader.attributes.position.location = 0

  // window.setInterval(() => map.panBy([window.innerWidth/3, 0]), 3000);
})

// const drawOverlay = () => {
//   map.panBy([50, 50]);
//   const mapCanvas = mapEl.querySelector('.mapboxgl-canvas');
//   // console.log(mapCanvas);
//   const ctx = overlay.getContext('2d');
//   // ctx.mozImageSmoothingEnabled = false;
//   // ctx.webkitImageSmoothingEnabled = false;
//   // ctx.msImageSmoothingEnabled = false;
//   // ctx.imageSmoothingEnabled = false;
//   // ctx.drawImage(tmpCanvas, 0, 0,600, 100);
//   ctx.clearRect(0, 0, overlay.width, overlay.height);
//   ctx.drawImage(mapCanvas, 0, 0)
//   window.setTimeout(drawOverlay, 500);
// }
// map.on('load', drawOverlay);

// console.log('tile grabber go!')
// tileGrabber(
//   tmpCanvas,
//   lon,
//   lat,
//   zoom,
//   256,
//   6,
//   // 'https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=' + MAPBOX_API_TOKEN
//   'https://b.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=' + MAPBOX_API_TOKEN
// ).on('progress', drawOverlay);






// import App from './js/app';

// const app = new App();

