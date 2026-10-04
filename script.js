import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js";

const container = document.getElementById("model-viewer");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 0.2, 4.2);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.minDistance = 2.2;
controls.maxDistance = 7;
controls.target.set(0, 0, 0);

scene.add(new THREE.HemisphereLight(0xffffff, 0x5c674f, 2.2));

const keyLight = new THREE.DirectionalLight(0xffffff, 3);
keyLight.position.set(3, 5, 4);
scene.add(keyLight);

const fill = new THREE.DirectionalLight(0xdcebc7, 2);
fill.position.set(-4, 2, 2);
scene.add(fill);

const loader = new GLTFLoader();

loader.load(
  "./sosai-key.glb",
  (gltf) => {
    const model = gltf.scene;

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const max = Math.max(size.x, size.y, size.z);
    const scale = 2.35 / max;

    model.scale.setScalar(scale);

    model.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale
    );

    model.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    scene.add(model);
  },
  undefined,
  (error) => {
    console.error(error);

    container.insertAdjacentHTML(
      "beforeend",
      '<div style="position:absolute;inset:0;display:grid;place-items:center;color:#71806b;font-size:13px">3D model could not be loaded.</div>'
    );
  }
);

function resize() {
  const width = container.clientWidth;
  const height = container.clientHeight;

  renderer.setSize(width, height, false);

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

new ResizeObserver(resize).observe(container);

resize();

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

animate();

const button = document.getElementById("sosButton");
const status = document.getElementById("statusText");
const dot = document.getElementById("statusDot");
const log = document.getElementById("log");

const voice = document.getElementById("voice");
const sound = document.getElementById("sound");
const temp = document.getElementById("temp");
const locationEl = document.getElementById("location");

button.addEventListener("click", () => {
  button.disabled = true;

  status.textContent = "COLLECTING DATA";
  log.textContent =
    "Collecting voice, sound, temperature and location signals…";

  voice.textContent = "Detected";
  sound.textContent = "Detected";
  temp.textContent = "High";
  locationEl.textContent = "Locating…";

  dot.style.background = "#d9b45b";

  setTimeout(() => {
    status.textContent = "AI VERIFICATION";

    log.textContent =
      "Multiple signals detected. Waiting briefly for user cancellation…";
  }, 1800);

  setTimeout(() => {
    locationEl.textContent = "Ready";

    status.textContent = "ALERT VERIFIED";

    log.textContent =
      "Prototype alert prepared for emergency call-centre verification. No real call was made.";

    dot.style.background = "#b85f58";

    button.textContent = "SIMULATION COMPLETE";
    button.disabled = false;
  }, 4200);
});
