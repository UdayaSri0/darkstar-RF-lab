import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";
import type {
  CameraState,
  CameraView,
  LabProject,
  RenderQuality,
  SelectionDetails,
  TerminalRef,
  VisualMode,
} from "../app/types";
import type { ComponentRegistry, RuntimeComponent } from "../components/registry";

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
  private readonly componentGroup = new THREE.Group();
  private readonly overlayGroup = new THREE.Group();
  private readonly runtimes = new Map<string, RuntimeComponent>();
  private selectables: THREE.Object3D[] = [];
  private selectedObject: THREE.Object3D | null = null;
  private selectedOriginalEmissive = 0;
  private animationFrame = 0;
  private lastFrame = performance.now();
  private frameSamples: number[] = [];
  private visualMode: VisualMode = "realistic";
  private labelsVisible = true;

  constructor(
    private readonly host: HTMLElement,
    private readonly registry: ComponentRegistry,
    private readonly callbacks: SceneCallbacks,
  ) {
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.domElement.className = "ds3d-canvas";
    this.renderer.domElement.setAttribute("aria-label", "Interactive 3D hardware lab viewport");
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

    this.scene.add(this.componentGroup, this.overlayGroup);
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
    const hit = this.raycaster.intersectObjects(this.selectables, false)[0];
    const baseSelection = hit?.object.userData.selection as SelectionDetails | undefined;
    const instanceId = hit?.object.userData.componentInstanceId as string | undefined;
    const selection = baseSelection && instanceId
      ? { ...baseSelection, instanceId }
      : baseSelection;
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
    this.visualMode = mode;
    this.runtimes.forEach((runtime) => runtime.setVisualMode(mode));
  }

  setLabelsVisible(visible: boolean): void {
    this.labelsVisible = visible;
    this.runtimes.forEach((runtime) => runtime.labels.forEach((label) => { label.visible = visible; }));
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
    this.syncComponents(project.components);
    this.clearOverlay();

    let renderedCableCount = 0;
    for (const cable of project.cables) {
      const from = this.resolveTerminalPosition(cable.from);
      const to = this.resolveTerminalPosition(cable.to);
      if (!from || !to) continue;
      const mid = from.clone().lerp(to, 0.5);
      mid.y += Math.max(7, from.distanceTo(to) * 0.16);
      const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
      const geometry = new THREE.TubeGeometry(curve, 32, 0.42, 8, false);
      const material = new THREE.MeshStandardMaterial({ color: cable.color, roughness: 0.48 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = cable.id;
      this.overlayGroup.add(mesh);
      renderedCableCount += 1;
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
    this.renderer.domElement.dataset.renderedCableCount = String(renderedCableCount);
  }

  private syncComponents(components: LabProject["components"]): void {
    const activeIds = new Set(components.map((component) => component.id));
    this.runtimes.forEach((runtime, instanceId) => {
      const instance = components.find((component) => component.id === instanceId);
      if (!activeIds.has(instanceId)
        || !instance
        || instance.typeId !== runtime.instance.typeId
        || instance.variantId !== runtime.instance.variantId) {
        if (this.selectedObject && runtime.selectables.includes(this.selectedObject)) {
          this.highlight(null);
          this.callbacks.onSelect(null);
        }
        runtime.dispose();
        this.runtimes.delete(instanceId);
      }
    });

    for (const instance of components) {
      let runtime = this.runtimes.get(instance.id);
      if (!runtime) {
        runtime = this.registry.createRuntime(instance);
        this.runtimes.set(instance.id, runtime);
        this.componentGroup.add(runtime.root);
        runtime.selectables.forEach((selectable) => {
          selectable.userData.componentInstanceId = instance.id;
        });
        runtime.setVisualMode(this.visualMode);
        runtime.labels.forEach((label) => { label.visible = this.labelsVisible; });
      }
      runtime.instance = structuredClone(instance);
      runtime.simulationAdapter?.apply(instance.properties);
      this.applyTransform(runtime, instance.transform);
    }

    const runtimes = components.map((component) => this.runtimes.get(component.id)).filter((runtime): runtime is RuntimeComponent => Boolean(runtime));
    this.selectables = runtimes.flatMap((runtime) => runtime.selectables);
    this.renderer.domElement.dataset.renderedComponentId = runtimes[0]?.instance.id ?? "";
    this.renderer.domElement.dataset.runtimeCount = String(runtimes.length);
    this.renderer.domElement.dataset.runtimeTypeIds = runtimes.map((runtime) => runtime.instance.typeId).join(",");
    this.renderer.domElement.dataset.placeholderCount = String(runtimes.filter((runtime) => runtime.status === "placeholder").length);
  }

  private applyTransform(runtime: RuntimeComponent, transform: LabProject["components"][number]["transform"]): void {
    const [rotationX, rotationY, rotationZ] = transform.rotationDeg;
    runtime.root.position.fromArray(transform.positionMm);
    runtime.root.rotation.set(
      THREE.MathUtils.degToRad(rotationX),
      THREE.MathUtils.degToRad(rotationY),
      THREE.MathUtils.degToRad(rotationZ),
    );
    runtime.root.scale.fromArray(transform.scale);
    runtime.root.updateMatrixWorld(true);
  }

  private clearOverlay(): void {
    this.overlayGroup.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
        child.geometry.dispose();
        const material = child.material;
        if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
        else material.dispose();
      }
    });
    this.overlayGroup.clear();
  }

  private resolveTerminalPosition(terminal: TerminalRef): THREE.Vector3 | null {
    const runtime = this.runtimes.get(terminal.instanceId);
    const point = runtime?.terminalAnchors.get(terminal.terminalId);
    return runtime && point ? runtime.root.localToWorld(point.clone()) : null;
  }

  getTerminalPosition(terminal: TerminalRef): [number, number, number] | null {
    const point = this.resolveTerminalPosition(terminal);
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
    this.clearOverlay();
    this.runtimes.forEach((runtime) => runtime.dispose());
    this.runtimes.clear();
    this.renderer.dispose();
    this.host.replaceChildren();
  }
}
