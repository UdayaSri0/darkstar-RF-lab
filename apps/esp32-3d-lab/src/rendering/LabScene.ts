import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import type {
  CameraState,
  CameraView,
  LabProject,
  RenderQuality,
  SelectionDetails,
  VisualMode,
} from "../app/types";
import type { BoardDefinition } from "../app/types";
import { createEsp32Board, type BoardModel } from "../boards/createEsp32Board";

export interface SceneCallbacks {
  onSelect: (selection: SelectionDetails | null) => void;
  onPointer: (position: THREE.Vector3 | null) => void;
  onFps: (fps: number) => void;
  onCameraChanged: (state: CameraState) => void;
}

export class LabScene {
  private readonly scene = new THREE.Scene();
  private readonly camera = new THREE.PerspectiveCamera(43, 1, 0.1, 1200);
  private readonly renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
  private readonly labelRenderer = new CSS2DRenderer();
  private readonly controls: OrbitControls;
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly workPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private readonly grid = new THREE.GridHelper(180, 36, 0x2e7492, 0x183447);
  private readonly boardModel: BoardModel;
  private readonly overlayGroup = new THREE.Group();
  private selectedObject: THREE.Object3D | null = null;
  private selectedOriginalEmissive = 0;
  private animationFrame = 0;
  private lastFrame = performance.now();
  private frameSamples: number[] = [];

  constructor(
    private readonly host: HTMLElement,
    board: BoardDefinition,
    private readonly callbacks: SceneCallbacks,
  ) {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.domElement.className = "ds3d-canvas";
    this.renderer.domElement.setAttribute("aria-label", "Interactive 3D ESP32 board viewport");
    this.renderer.domElement.tabIndex = 0;
    this.labelRenderer.domElement.className = "ds3d-label-layer";

    this.host.append(this.renderer.domElement, this.labelRenderer.domElement);
    this.scene.background = new THREE.Color(0x071019);
    this.scene.fog = new THREE.FogExp2(0x071019, 0.005);

    this.camera.position.set(58, 58, 70);
    this.controls = new OrbitControls(this.camera, this.labelRenderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.target.set(0, 3, 0);
    this.controls.minDistance = 35;
    this.controls.maxDistance = 220;
    this.controls.maxPolarAngle = Math.PI * 0.49;

    this.boardModel = createEsp32Board(board);
    this.scene.add(this.boardModel.group, this.overlayGroup);
    this.createEnvironment();
    this.bindEvents();
    this.resize();
    this.animate();
  }

  private createEnvironment(): void {
    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(180, 3, 130),
      new THREE.MeshStandardMaterial({ color: 0x101c24, roughness: 0.88, metalness: 0.18 }),
    );
    bench.position.y = -2;
    bench.receiveShadow = true;
    bench.name = "ESD workbench";
    this.scene.add(bench);
    this.grid.position.y = -0.45;
    this.scene.add(this.grid);

    const hemisphere = new THREE.HemisphereLight(0x9fd8ff, 0x081018, 1.6);
    const key = new THREE.DirectionalLight(0xeaf6ff, 3.2);
    key.position.set(35, 70, 40);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -60;
    key.shadow.camera.right = 60;
    key.shadow.camera.top = 60;
    key.shadow.camera.bottom = -60;
    const rim = new THREE.PointLight(0x3fc5ff, 22, 120);
    rim.position.set(-45, 25, -35);
    this.scene.add(hemisphere, key, rim);
  }

  private bindEvents(): void {
    this.renderer.domElement.addEventListener("pointermove", (event) => this.handlePointer(event, false));
    this.renderer.domElement.addEventListener("pointerdown", (event) => this.handlePointer(event, true));
    this.controls.addEventListener("end", () => this.callbacks.onCameraChanged(this.getCameraState()));
    window.addEventListener("resize", this.resize);
  }

  private readonly resize = (): void => {
    const { clientWidth, clientHeight } = this.host;
    if (!clientWidth || !clientHeight) return;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight, false);
    this.labelRenderer.setSize(clientWidth, clientHeight);
  };

  private handlePointer(event: PointerEvent, select: boolean): void {
    const bounds = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const planePoint = new THREE.Vector3();
    this.callbacks.onPointer(this.raycaster.ray.intersectPlane(this.workPlane, planePoint) ? planePoint : null);
    if (!select) return;
    const hit = this.raycaster.intersectObjects(this.boardModel.selectables, false)[0];
    const selection = hit?.object.userData.selection as SelectionDetails | undefined;
    this.highlight(hit?.object ?? null);
    this.callbacks.onSelect(selection ?? null);
  }

  private highlight(object: THREE.Object3D | null): void {
    if (this.selectedObject instanceof THREE.Mesh) {
      const material = this.selectedObject.material as THREE.MeshStandardMaterial;
      if ("emissive" in material) material.emissive.setHex(this.selectedOriginalEmissive);
    }
    this.selectedObject = object;
    if (object instanceof THREE.Mesh) {
      const material = object.material as THREE.MeshStandardMaterial;
      if ("emissive" in material) {
        this.selectedOriginalEmissive = material.emissive.getHex();
        material.emissive.setHex(0x0c658a);
      }
    }
  }

  private readonly animate = (): void => {
    this.animationFrame = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
    const now = performance.now();
    const delta = now - this.lastFrame;
    this.lastFrame = now;
    if (delta > 0) this.frameSamples.push(1000 / delta);
    if (this.frameSamples.length >= 30) {
      this.callbacks.onFps(Math.round(this.frameSamples.reduce((sum, value) => sum + value, 0) / this.frameSamples.length));
      this.frameSamples = [];
    }
  };

  setInteractionMode(mode: "rotate" | "pan" | "select"): void {
    this.controls.enabled = true;
    this.controls.mouseButtons.LEFT = mode === "pan" ? THREE.MOUSE.PAN : mode === "rotate" ? THREE.MOUSE.ROTATE : THREE.MOUSE.ROTATE;
  }

  setVisualMode(mode: VisualMode): void {
    this.boardModel.setVisualMode(mode);
  }

  setLabelsVisible(visible: boolean): void {
    for (const label of this.boardModel.labels) label.visible = visible;
  }

  setGridVisible(visible: boolean): void {
    this.grid.visible = visible;
  }

  setQuality(quality: RenderQuality): void {
    const ratio = quality === "low" ? 0.75 : quality === "medium" ? 1 : Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(ratio);
    this.renderer.shadowMap.enabled = quality !== "low";
    this.resize();
  }

  setCameraView(view: CameraView): void {
    const positions: Record<CameraView, [number, number, number]> = {
      perspective: [58, 58, 70],
      top: [0, 105, 0.01],
      front: [0, 18, 105],
      side: [105, 18, 0],
    };
    this.camera.position.set(...positions[view]);
    this.controls.target.set(0, 3, 0);
    this.controls.update();
    this.callbacks.onCameraChanged(this.getCameraState());
  }

  resetCamera(): void {
    this.setCameraView("perspective");
  }

  getCameraState(): CameraState {
    return {
      position: this.camera.position.toArray() as [number, number, number],
      target: this.controls.target.toArray() as [number, number, number],
    };
  }

  restoreCamera(state: CameraState): void {
    this.camera.position.fromArray(state.position);
    this.controls.target.fromArray(state.target);
    this.controls.update();
  }

  renderProject(project: LabProject): void {
    this.overlayGroup.clear();
    for (const wire of project.wires) {
      const from = this.boardModel.pinPositions.get(wire.fromPinId);
      const to = this.boardModel.pinPositions.get(wire.toPinId);
      if (!from || !to) continue;
      const mid = from.clone().lerp(to, 0.5);
      mid.y += Math.max(7, from.distanceTo(to) * 0.16);
      const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
      const geometry = new THREE.TubeGeometry(curve, 32, 0.42, 8, false);
      const material = new THREE.MeshStandardMaterial({ color: wire.color, roughness: 0.48 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = wire.id;
      this.overlayGroup.add(mesh);
    }
    for (const measurement of project.measurements) {
      const points = [new THREE.Vector3(...measurement.from), new THREE.Vector3(...measurement.to)];
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineDashedMaterial({ color: 0xffcf66, dashSize: 1.4, gapSize: 0.7 }),
      );
      line.computeLineDistances();
      this.overlayGroup.add(line);
    }
  }

  getPinPosition(pinId: string): [number, number, number] | null {
    const point = this.boardModel.pinPositions.get(pinId);
    return point ? (point.toArray() as [number, number, number]) : null;
  }

  exportScreenshot(): void {
    this.renderer.render(this.scene, this.camera);
    const link = document.createElement("a");
    link.download = `darkstar-esp32-lab-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = this.renderer.domElement.toDataURL("image/png");
    link.click();
  }

  dispose(): void {
    cancelAnimationFrame(this.animationFrame);
    window.removeEventListener("resize", this.resize);
    this.controls.dispose();
    this.renderer.dispose();
    this.host.replaceChildren();
  }
}
