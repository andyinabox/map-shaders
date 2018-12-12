import * as dat from 'dat.gui';
import mapboxgl from 'mapbox-gl';
import geolocation from 'geolocation';
import createShell from 'gl-now';
import createTexture from 'gl-texture2d';
import createShader from 'gl-shader';
import drawTriangle from 'a-big-triangle';

mapboxgl.accessToken = process.env.MAPBOX_API_TOKEN;

export default class App {
  constructor(config={}) {
    this.params = config.params;
    this.opts = config.options;
    this.shaders = config.shaders;

    this.params.deltaMapPixels = [0, 0];

    Object.keys(this.shaders).forEach(key => {
      const shader = this.shaders[key];
      shader.vert = require(`../glsl/${shader.vert}`);
      shader.frag = require(`../glsl/${shader.frag}`);
    });

    this.el = document.createElement('div');
    this.el.id = 'map';
    document.body.append(this.el);

    this.mouseDown = [null, null];

    this.map = new mapboxgl.Map({
      container: this.el,
      style: this.opts.mapStyles[this.params.mapStyle],
      zoom: this.params.zoom,
      center: new mapboxgl.LngLat(this.params.lon, this.params.lat)
    });
    this.map.on('load', this.update.bind(this));

    this.shell = createShell();
    this.shell.preventDefaults = false;
    this.shell.stopPropagation = false;

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

    // if(this.document) {
    //   this.document.addEventListener('keydown', function (e) {
    //     e.preventDefault();
    //     console.log(e.which);
    //     if (e.which === 38) { // up
    //       map.panBy([0, -deltaDistance], {
    //         easing: easing
    //       });
    //     } else if (e.which === 40) { // down
    //       map.panBy([0, deltaDistance], {
    //         easing: easing
    //       });
    //     } else if (e.which === 37) { // left
    //       map.easeTo({
    //         bearing: map.getBearing() - deltaDegrees,
    //         easing: easing
    //       });
    //     } else if (e.which === 39) { // right
    //       map.easeTo({
    //         bearing: map.getBearing() + deltaDegrees,
    //         easing: easing
    //       });
    //     }
    //   }, true);    
    // }

  }

  glInit() {
    this.startTime = (new Date()).getTime();
    this.setupGui();
    this.update();
  }

  tick(t) {
    // const panX = this.shell.mouseX - this.shell.width/2.0;
    // const panY = this.shell.mouseY - this.shell.width / 2.0;
    // console.log(panX, panY);
    // if(!this.map.isMoving) {
    //   this.map.panBy([panX / 2., panY / 2.]);
    // }
    // console.log( this.shell.release('i') );
  }

  glRender(t) {
    const mouseDelta = [this.shell.mouseX - this.shell.prevMouseX, this.shell.mouseY - this.shell.prevMouseY];
    const panX = mouseDelta[0] * this.params.movementSpeed;
    const panY = mouseDelta[1] * this.params.movementSpeed;
    this.params.deltaMapPixels[0] += panX;
    this.params.deltaMapPixels[1] += panY;
    this.map.panBy([panX, panY], { animate: false });
    const center = this.map.getCenter().toArray();
    this.params.lat = center[1];
    this.params.lon = center[0];
    // console.log(this.params.deltaMapPixels);
    //Draw it
    if (this.texture && this.shader && this.mapCanvas) {
      this.texture.setPixels(this.mapCanvas);
      this.shader.bind()
      this.setShaderToyUniforms(this.shader, [this.texture], t);
      this.shader.uniforms.deltaMapPixels = this.params.deltaMapPixels;
      this.shader.uniforms.mapCoordinates = [this.params.lon, this.params.lat, this.params.zoom];
      // console.log(this.shader.uniforms.deltaMapPixels);
      // this.shader.uniforms.panDelta = [
      //   this.shell.width/this.shell.width-panX,
      //   this.shell.height/this.shell.height-panY
      // ]
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

    this.gui.domElement.addEventListener('clock', evt => console.log(evt));

    // set gui controls
    this.gui.add(this.params, 'shader', Object.keys(this.shaders));
    this.gui.add(this.params, 'mapStyle', Object.keys(this.opts.mapStyles));
    this.gui.add(this.params, "movementSpeed", 0, 30);
    // this.gui.add(this.params, "movementX", -1, 1);
    // this.gui.add(this.params, "movementY", -1, 1);

    // automatically set listener for all params
    this.gui.__controllers.forEach((controller, index) => {
      controller.listen().onChange(this.update.bind(this));
    });
  }

  update() {
    const gl = this.shell.gl;
    const mapCanvas = this.el.querySelector('.mapboxgl-canvas');

    const styleUrl = this.opts.mapStyles[this.params.mapStyle];
    if( styleUrl !== this.map.getStyle()) {
      this.map.setStyle(styleUrl);
    }

    if(!this.locationSet) {
      this.getCurrentLocation();
    }

    if(gl && mapCanvas) {
      const vert = this.shaders[this.params.shader].vert;
      const frag = this.shaders[this.params.shader].frag;
      console.log("VERT SHADER");
      console.log(vert);
      console.log("FRAG SHADER");
      console.log(frag);

      this.mapCanvas = mapCanvas;
      this.texture = createTexture(gl, this.mapCanvas)
      this.shader = createShader(gl, vert, frag);
      this.shader.attributes.position.location = 0
    }
  }

  getCurrentLocation() {
    geolocation.getCurrentPosition((err, position) => {
      if (err) console.error(err);

      this.params.lat = position.coords.latitude;
      this.params.lon = position.coords.longitude;
      // params.zoom = 17;
      this.map.setCenter([this.params.lon, this.params.lat]);
      this.locationSet = true;
    });
  }

};
