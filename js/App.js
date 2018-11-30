import * as dat from 'dat.gui';
import mapboxgl from 'mapbox-gl';
import createShell from 'gl-now';
import createTexture from 'gl-texture2d';
import createShader from 'gl-shader';
import drawTriangle from 'a-big-triangle';

mapboxgl.accessToken = process.env.MAPBOX_API_TOKEN;

const _shaders = {
  default: {
    vert: require('../glsl/default.vert'),
    frag: require('../glsl/default.frag')
  },
  water: {
    vert: require('../glsl/default.vert'),
    frag: require('../glsl/water.frag')
  },
  breathe: {
    vert: require('../glsl/default.vert'),
    frag: require('../glsl/breathe.frag')
  }
}

const _map_styles = {
  satellite: 'mapbox://styles/mapbox/satellite-v9'
};

// params used for the gui
const _default_params = {
  mapStyle: 'satellite',
  shader: 'breathe',
  lon: -93.282496,
  lat: 44.9998631,
  zoom: 16
};

// costructor options
const _default_options = {
  mapCanvasSelector: '.mapboxgl-canvas'
}


export default class App {
  constructor(params={}, options={}) {
    this.params = Object.assign({}, _default_params, params);
    this.opts = Object.assign({}, _default_options, options);

    this.el = document.createElement('div');
    this.el.id = 'map';
    document.body.append(this.el);

    this.mouseDown = [null, null];

    this.map = new mapboxgl.Map({
      container: this.el,
      style: _map_styles[this.params.mapStyle],
      zoom: this.params.zoom,
      center: new mapboxgl.LngLat(this.params.lon, this.params.lat)
    });
    this.map.on('load', this.update.bind(this));

    this.shell = createShell();
    this.shell.preventDefaults = false;

    // events
    document.addEventListener('mousedown', evt => {
      this.mouseDown = [this.shell.mouseX, this.shell.mouseY]
    });
    document.addEventListener('mouseup', evt => {
      this.mouseDown = [null, null]
    });

    this.shell.on('gl-init', this.glInit.bind(this));
    this.shell.on('tick', this.tick.bind(this));
    this.shell.on('gl-render', this.glRender.bind(this));


  }

  glInit() {
    this.startTime = (new Date()).getTime();
    this.setupGui();
    this.update();
  }

  tick(t) {

  }
  
  glRender(t) {
    //Draw it
    if (this.texture && this.shader && this.mapCanvas) {
      this.texture.setPixels(this.mapCanvas);
      this.shader.bind()
      this.setShaderToyUniforms(this.shader, [this.texture], t);
    }
    drawTriangle(this.shell.gl)
  }

  setShaderToyUniforms(shader, textures=[], renderTime) {
    shader.uniforms.iResolution = [this.shell.width, this.height, 1.0];
    shader.uniforms.iTime = (new Date()).getTime() - this.startTime;
    shader.uniforms.iTimeDelta = renderTime;
    shader.uniforms.iFrame = parseInt(this.shell.frameCount);
    shader.uniforms.iMouse = [this.shell.mouseX, this.shell.mouseY, this.mouseDown[0], this. mouseDown[1]];

    textures.forEach((tex, i) => {
      shader.uniforms['iChannel'+i] = tex.bind(i);
    });
  }

  setupGui() {
    this.gui = new dat.GUI();

    // set gui controls
    this.gui.add(this.params, 'shader', Object.keys(_shaders));
    this.gui.add(this.params, 'mapStyle', Object.keys(_map_styles));

    // automatically set listener for all params
    this.gui.__controllers.forEach((controller, index) => {
      controller.listen().onChange(this.update.bind(this));
    });
  }

  update() {
    const gl = this.shell.gl;
    const mapCanvas = this.el.querySelector('.mapboxgl-canvas');
    if(gl && mapCanvas) {
      this.mapCanvas = mapCanvas;
      this.texture = createTexture(gl, this.mapCanvas)
      this.shader = createShader(gl, _shaders[this.params.shader].vert, _shaders[this.params.shader].frag);
      this.shader.attributes.position.location = 0
    }
  }

};
