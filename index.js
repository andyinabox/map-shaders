import './styles.scss';
import mapboxgl from 'mapbox-gl';
import tileGrabber from './tile-grabber';

const MAPBOX_API_TOKEN = "pk.eyJ1IjoiYW1kYXl0b24iLCJhIjoiY2pwMWNhejQ5MGE3dTNxcWcyZDVnMHcyciJ9.Zp_La2z0S0OTBEZm6QBaKQ";

mapboxgl.accessToken = MAPBOX_API_TOKEN;

const mapEl = document.createElement('div');
mapEl.id = 'map';
// mapEl.width = window.innerWidth;
// mapEl.height = window.innerHeight;
document.body.append(mapEl);

var lon = -93.282496;
var lat = 44.9998631;
var zoom = 14;

const map = new mapboxgl.Map({
  container: mapEl,
  style: 'mapbox://styles/mapbox/satellite-v9',
  // style: 'mapbox://mapbox.terrain-rgb',
  zoom: zoom,
  center: new mapboxgl.LngLat(lon ,lat)
});

map.on('load', () => {
  const mapCanvas = mapEl.querySelector('canvas');
  console.log(mapCanvas);
  const ctx = mapCanvas.getContext('webgl');
  console.log(ctx);
})


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


const overlay = document.createElement('canvas');
overlay.id = 'overlay';
overlay.width = window.innerWidth;
overlay.height = window.innerHeight;
document.body.append(overlay);

const tmpCanvas = document.createElement('canvas');

const drawOverlay = () => {
  map.panBy([50, 50]);
  const mapCanvas = mapEl.querySelector('.mapboxgl-canvas');
  // console.log(mapCanvas);
  const ctx = overlay.getContext('2d');
  // ctx.mozImageSmoothingEnabled = false;
  // ctx.webkitImageSmoothingEnabled = false;
  // ctx.msImageSmoothingEnabled = false;
  // ctx.imageSmoothingEnabled = false;
  // ctx.drawImage(tmpCanvas, 0, 0,600, 100);
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  ctx.drawImage(mapCanvas, 0, 0)
  window.setTimeout(drawOverlay, 500);
}
map.on('load', drawOverlay);

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

