import * as dat from 'dat.gui';
import * as THREE from 'three';
import OrbitControls from "orbit-controls-es6";
import { OBJLoader } from '@calvinscofield/three-loaders';

// params used for the gui
const _default_params = {
  color: 0x00ff00
};

// costructor options
const _default_options = {
  color: 0x00ff00,
  camFov: 60,
  camNear: 0.1,
  camFar: 1000
}


export default class App {
  constructor(params={}, options={}) {
    this.params = Object.assign({}, _default_params, params);
    this.opts = Object.assign({}, _default_options, options);

    // set the scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      this.opts.camFov,
      window.innerWidth / window.innerHeight,
      this.opts.camNear,
      this.opts.camFar
    );
    this.camera.position.z = 3;

    // set up renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // orbit controls
    this.controls =  new OrbitControls(this.camera, this.renderer.domElement);

    // .obj loader
    this.loader = new OBJLoader();
    this.loader.load('/assets/TV.obj', obj => {
      this.tv = obj;
      this.tv.traverse(child => {
        if (child.isMesh) {
          child.material = new THREE.MeshBasicMaterial({
            color: this.params.color,
            wireframe: true
          });
        }
      });
      this.scene.add(this.tv);
      this.update();
    });



    this.setupGui();

    const animate = () => {
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
    }
    animate();
  }

  setupGui() {
    this.gui = new dat.GUI();

    // set gui controls
    this.gui.addColor(this.params, 'color');

    // automatically set listener for all params
    this.gui.__controllers.forEach((controller, index) => {
      controller.listen().onChange(this.update.bind(this));
    });
  }


  update() {
    if(this.tv) {
      this.tv.traverse(child => {
        if (child.isMesh) {
          child.material.color.set(this.params.color);
        }
      });
    }
  }

};
