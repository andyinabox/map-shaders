import './styles.scss';
import mapboxgl from 'mapbox-gl';
import tileGrabber from './tile-grabber';

const MAPBOX_API_TOKEN = "pk.eyJ1IjoiYW1kYXl0b24iLCJhIjoiY2pwMWNhejQ5MGE3dTNxcWcyZDVnMHcyciJ9.Zp_La2z0S0OTBEZm6QBaKQ";

mapboxgl.accessToken = MAPBOX_API_TOKEN;

const mapEl = document.createElement('div');
mapEl.id = 'map';
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



map.on('load', drawOverlay);



// import App from './js/app';

// const app = new App();

