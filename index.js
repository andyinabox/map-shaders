import './styles.scss';
import mapboxgl from 'mapbox-gl';
import createShell from 'gl-now';
import createTexture from 'gl-texture2d';
import createShader from 'gl-shader';
import drawTriangle from 'a-big-triangle';

// import App from './js/app';
// const app = new App();

mapboxgl.accessToken = process.env.MAPBOX_API_TOKEN;

const shell = createShell();
shell.preventDefaults = false;

const shaders = {
  default: {
    vert: require('./glsl/default.vert'),
    frag: require('./glsl/default.frag')
  },
  water: {
    vert: require('./glsl/default.vert'),
    frag: require('./glsl/water.frag')   
  },
  breathe: {
    vert: require('./glsl/default.vert'),
    frag: require('./glsl/breathe.frag')
  }
}

const lon = -93.282496;
const lat = 44.9998631;
const zoom = 15;

let shader;
let texture;
let mapCanvas;
let startTime;
let mouseDown = [null, null];


const mapEl = document.createElement('div');
mapEl.id = 'map';
document.body.append(mapEl);

const map = new mapboxgl.Map({
  container: mapEl,
  style: 'mapbox://styles/mapbox/satellite-v9',
  zoom: zoom,
  center: new mapboxgl.LngLat(lon, lat)
});


// events
document.addEventListener('mousedown', evt => mouseDown = [shell.mouseX, shell.mouseY]);
document.addEventListener('mouseup', evt => mouseDown = [null, null]);

shell.on("gl-init", function () {
  startTime = (new Date()).getTime();
})

shell.on('tick', (t) => {

});

shell.on("gl-render", function (t) {
  //Draw it
  if(texture && shader && mapCanvas) {
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
  shader = createShader(gl, shaders.breathe.vert, shaders.breathe.frag);
  shader.attributes.position.location = 0
})







