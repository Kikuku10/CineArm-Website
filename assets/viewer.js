/* CineArm — lightweight three.js arm viewer.
 *
 * Geometry is pre-baked offline from the app's own robot models: a decimated
 * triangle soup, quantized to uint16 against the model bounding box.
 * No CDN, no loaders beyond three core.
 */
import * as THREE from "./vendor/three.module.min.js";

const META_CACHE = new Map();

async function loadMeta(url) {
  if (META_CACHE.has(url)) return META_CACHE.get(url);
  const response = await fetch(url);
  if (!response.ok) throw new Error("models.json " + response.status);
  const meta = await response.json();
  META_CACHE.set(url, meta);
  return meta;
}

async function loadGeometry(entry, base) {
  const buffer = await (await fetch(base + entry.file)).arrayBuffer();
  const u16 = new Uint16Array(buffer);
  const positions = new Float32Array(u16.length);
  for (let axis = 0; axis < 3; axis += 1) {
    const lo = entry.min[axis];
    const scale = (entry.max[axis] - lo) / 65535;
    for (let i = axis; i < u16.length; i += 3) positions[i] = lo + u16[i] * scale;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  return geometry;
}

function label(id, entry) {
  return (entry.name || id).replace(/^Dobot\s+/i, "");
}

class ArmViewer {
  constructor(root) {
    this.root = root;
    this.canvas = root.querySelector("canvas");
    this.metaUrl = root.dataset.models || "assets/models/models.json";
    this.base = root.dataset.base || "assets/models/";
    this.defaultId = root.dataset.default || "cr10a";
    this.buttons = root.querySelector("[data-models-switch]");
    this.mesh = null;
    this.azimuth = -0.55;
    this.polar = 1.16;
    this.distance = 3.2;
    this.targetY = 0.35;
    this.spin = true;
    this.pointer = null;
    this.init();
  }

  init() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);

    const key = new THREE.DirectionalLight(0xffffff, 2.8);
    key.position.set(2.4, 3.4, 2.6);
    const rim = new THREE.DirectionalLight(0x73d0ce, 1.5);
    rim.position.set(-3, 1.4, -2.2);
    const fill = new THREE.HemisphereLight(0xbcd6ef, 0x0a1019, 1.35);
    this.scene.add(key, rim, fill);

    this.holder = new THREE.Group();
    this.holder.rotation.x = -Math.PI / 2; // URDF models are Z-up
    this.scene.add(this.holder);

    this.material = new THREE.MeshStandardMaterial({
      color: 0xb9c9dc,
      metalness: 0.55,
      roughness: 0.34
    });
    this.accent = new THREE.MeshStandardMaterial({
      color: 0x00a9a6,
      metalness: 0.35,
      roughness: 0.5
    });

    this.bind();
    this.resize();
    this.load(this.defaultId);
    this.loop();
  }

  bind() {
    const canvas = this.canvas;
    const down = (event) => {
      this.pointer = { x: event.clientX, y: event.clientY };
      this.spin = false;
      canvas.setPointerCapture?.(event.pointerId);
    };
    const move = (event) => {
      if (!this.pointer) return;
      this.azimuth -= (event.clientX - this.pointer.x) * 0.008;
      this.polar = Math.min(2.4, Math.max(0.35, this.polar - (event.clientY - this.pointer.y) * 0.006));
      this.pointer = { x: event.clientX, y: event.clientY };
    };
    const up = () => {
      this.pointer = null;
      window.setTimeout(() => { if (!this.pointer) this.spin = true; }, 2600);
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", up);
    canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      this.distance = Math.min(9, Math.max(1.4, this.distance * (1 + Math.sign(event.deltaY) * 0.08)));
    }, { passive: false });
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  async load(modelId) {
    try {
      const meta = await loadMeta(this.metaUrl);
      const entry = meta[modelId];
      if (!entry) return;
      const geometry = await loadGeometry(entry, this.base);

      if (this.mesh) {
        this.holder.remove(this.mesh);
        this.mesh.geometry.dispose();
      }
      this.mesh = new THREE.Mesh(geometry, this.material);
      const box = geometry.boundingBox;
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);
      this.mesh.position.set(-center.x, -center.y, -center.z);
      this.holder.add(this.mesh);

      this.radius = Math.max(size.x, size.y, size.z);
      this.distance = this.radius * 1.9;
      this.polar = 1.18;
      this.root.dataset.loaded = "true";
      this.markActive(modelId);
    } catch (error) {
      this.root.dataset.error = String(error.message || error);
    }
  }

  markActive(modelId) {
    if (!this.buttons) return;
    this.buttons.querySelectorAll("button").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.model === modelId));
    });
  }

  renderButtons(meta) {
    if (!this.buttons || this.buttons.childElementCount) return;
    Object.entries(meta).forEach(([id, entry]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.model = id;
      button.textContent = label(id, entry);
      button.addEventListener("click", () => this.load(id));
      this.buttons.appendChild(button);
    });
    this.markActive(this.defaultId);
  }

  loop() {
    const tick = () => {
      if (this.spin) this.azimuth += 0.0022;

      const sin = Math.sin(this.polar);
      this.camera.position.set(
        this.distance * sin * Math.cos(this.azimuth),
        this.distance * Math.cos(this.polar),
        this.distance * sin * Math.sin(this.azimuth)
      );
      this.camera.lookAt(0, 0, 0);
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}

async function boot() {
  const roots = [...document.querySelectorAll("[data-arm-viewer]")];
  if (!roots.length) return;
  let meta = null;
  try {
    meta = await loadMeta(roots[0].dataset.models || "assets/models/models.json");
  } catch (_) {
    meta = null;
  }
  roots.forEach((root) => {
    const viewer = new ArmViewer(root);
    if (meta) viewer.renderButtons(meta);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
