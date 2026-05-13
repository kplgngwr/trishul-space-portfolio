import { useEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { useReducedMotion } from "@/shared/lib";

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const MODEL_URL = `${import.meta.env.BASE_URL}models/Harpy-1-Assembly-R1-v1.glb`;
const HDR_URLS = [
  `${import.meta.env.BASE_URL}hdr/industrial_workshop_foundry_1k.hdr`,
  `${import.meta.env.BASE_URL}hdr/studio.hdr`,
];
const DRACO_PATH = "https://www.gstatic.com/draco/versioned/decoders/1.5.5/";

// Framing knobs:
// - MODEL_TARGET_SIZE is the main zoom control. Higher = bigger model.
// - CAMERA_FOV is optical zoom. Lower = more zoom/compressed perspective.
const MODEL_TARGET_SIZE = 2.25;
const CAMERA_FOV = 22;
const CAMERA_POSITION = new THREE.Vector3(2.4, 1.05, 5.8);
const INITIAL_MODEL_Y_ROTATION = -0.12;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function assetExists(url: string): Promise<boolean> {
  try {
    const r = await fetch(url, { method: "HEAD", cache: "no-store" });
    const ct = r.headers.get("content-type") ?? "";
    return r.ok && !ct.includes("text/html");
  } catch {
    return false;
  }
}

async function firstExistingAsset(urls: string[]): Promise<string | null> {
  for (const url of urls) {
    if (await assetExists(url)) return url;
  }
  return null;
}

function disposeObject(root: THREE.Object3D): void {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    child.geometry.dispose();
    const mats = Array.isArray(child.material)
      ? child.material
      : [child.material];
    mats.forEach((m) => {
      Object.values(m).forEach((v) => {
        if (v instanceof THREE.Texture) v.dispose();
      });
      m.dispose();
    });
  });
}

function fitModel(
  model: THREE.Object3D,
  targetSize = MODEL_TARGET_SIZE,
): THREE.Box3 {
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  const scale = targetSize / Math.max(size.x, size.y, size.z, 0.001);
  model.scale.setScalar(scale);
  model.position.sub(center.multiplyScalar(scale));
  model.position.y += 0.05;
  return new THREE.Box3().setFromObject(model);
}

/**
 * Apply realistic stainless-steel PBR values.
 *
 * CAD GLB exports typically have roughness ≈ 0 (pure mirror) and metalness ≈ 0.
 * We OVERRIDE them with physically-plausible values and keep the original color.
 *
 * Steel grade reference:
 *   - polished vessel (bright)  → roughness 0.32, metalness 1.0
 *   - machined pipe / tube      → roughness 0.48, metalness 0.95
 *   - dark hardware / fasteners → roughness 0.55, metalness 0.70
 */
function steelMaterial(
  mat: THREE.MeshStandardMaterial,
  meshName: string,
): void {
  const name = `${mat.name ?? ""} ${meshName ?? ""}`.toLowerCase();
  const col = mat.color;
  const luminance = col.r * 0.299 + col.g * 0.587 + col.b * 0.114;

  // Dark hardware (bolts, nuts, o-rings, wire-ties, clamps)
  const isDark =
    luminance < 0.1 ||
    /bolt|nut|screw|fastener|clamp|wire|cable|ring|o-ring|oring|seal|gasket|dark|black/.test(
      name,
    );

  if (isDark) {
    // Keep dark — just make them matte-metal not flat-black
    mat.metalness = 0.65;
    mat.roughness = 0.58;
    mat.envMapIntensity = 0.75;
    // Slightly lift pitch-black to dark-charcoal so they read as metal
    if (luminance < 0.06) {
      mat.color.setRGB(0.025, 0.026, 0.028);
    }
  } else {
    // Stainless / machined steel body
    const isVeryBright = luminance > 0.72; // polished vessel faces

    mat.metalness = 1.0;
    mat.roughness = isVeryBright ? 0.28 : 0.4; // polished sphere vs. tube
    mat.envMapIntensity = isVeryBright ? 1.7 : 1.3;

    // CAD exports often have pure-white (1,1,1) — nudge to neutral steel
    if (luminance > 0.85) {
      mat.color.setRGB(0.54, 0.54, 0.51);
    }
  }

  // Anisotropic filtering on any baked textures
  [mat.map, mat.normalMap, mat.roughnessMap, mat.metalnessMap].forEach((t) => {
    if (!t) return;
    t.anisotropy = 16;
    if (t === mat.map) t.colorSpace = THREE.SRGBColorSpace;
  });

  mat.needsUpdate = true;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export function RocketModel(): ReactNode {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    RectAreaLightUniformsLib.init();

    // ── Scene ──────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = null; // keep website background visible

    // ── Camera — longer/lower lens makes the model feel photographed ───────
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100);
    camera.position.copy(CAMERA_POSITION);

    // ── Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // Keep exposure restrained so stainless steel does not wash out to chrome.
    renderer.toneMappingExposure = 0.45;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const sceneTarget = new THREE.Vector3(0, 0.2, 0);
    camera.lookAt(sceneTarget);

    // ── Lighting ───────────────────────────────────────────────────────────
    // Rule: HDR carries 80 % of the lighting. Manual lights only add:
    //   (a) a shadow-casting key  (b) rim separation  (c) subtle fill
    //
    // Keeping intensities LOW avoids the washed-out chrome look.

    // Tiny ambient — only fills the absolute-darkest crevices
    scene.add(new THREE.AmbientLight(0xffffff, 0.035));

    // Hemisphere — warm sky / cool ground, prevents pure-black undersides
    scene.add(new THREE.HemisphereLight(0xf5f5ee, 0xd0d4dc, 0.12));

    // Key light — sole shadow caster, low intensity (HDR is doing the work)
    const key = new THREE.DirectionalLight(0xffffff, 0.65);
    key.position.set(5, 8, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 18;
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -4;
    key.shadow.bias = -0.0003;
    key.shadow.normalBias = 0.05;
    key.shadow.radius = 2;
    scene.add(key);

    // Front-left softbox — creates the large bright highlight on curved faces
    const sb1 = new THREE.RectAreaLight(0xffffff, 1.1, 2.2, 4.4);
    sb1.position.set(-2.8, 2.5, 3.8);
    sb1.lookAt(0, 0.25, 0);
    scene.add(sb1);

    // Front-right fill — keeps right side readable without matching left
    const sb2 = new THREE.RectAreaLight(0xffffff, 0.35, 1.8, 2.8);
    sb2.position.set(3.8, 1.6, 3.2);
    sb2.lookAt(0, 0.1, 0);
    scene.add(sb2);

    // Cool-blue rim from behind — separates model from background
    const rim = new THREE.RectAreaLight(0xd8e8ff, 0.9, 2.8, 2.0);
    rim.position.set(-3.5, 2.2, -4.0);
    rim.lookAt(0, 0.25, 0);
    scene.add(rim);

    // ── Shadow catcher ─────────────────────────────────────────────────────
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 16),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.3 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── Model root ─────────────────────────────────────────────────────────
    const modelRoot = new THREE.Group();
    scene.add(modelRoot);

    // ── Loaders ────────────────────────────────────────────────────────────
    const lm = new THREE.LoadingManager();
    const draco = new DRACOLoader(lm);
    draco.setDecoderPath(DRACO_PATH);
    draco.setDecoderConfig({ type: "wasm" });
    const gltfLoader = new GLTFLoader(lm);
    gltfLoader.setDRACOLoader(draco);

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();

    let envTex: THREE.Texture | null = null;
    let model: THREE.Object3D | null = null;
    let rafId = 0;
    let dead = false;

    // ── HDR ────────────────────────────────────────────────────────────────
    firstExistingAsset(HDR_URLS).then((hdrUrl) => {
      if (!hdrUrl || dead) return;
      new HDRLoader(lm).load(
        hdrUrl,
        (hdr) => {
          if (dead) {
            hdr.dispose();
            return;
          }
          hdr.mapping = THREE.EquirectangularReflectionMapping;
          envTex = pmrem.fromEquirectangular(hdr).texture;
          hdr.dispose();
          scene.environment = envTex;
          // Let HDR reflections define the metal, while exposure stays restrained.
          scene.environmentIntensity = 1.05;
          scene.environmentRotation.set(0, Math.PI * 0.22, 0);
        },
        undefined,
        (e) => console.warn("[RocketModel] HDR skipped:", e),
      );
    });

    // ── Model ──────────────────────────────────────────────────────────────
    gltfLoader.load(
      MODEL_URL,
      (loaded) => {
        if (dead) {
          disposeObject(loaded.scene);
          return;
        }

        model = loaded.scene;

        model.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          child.castShadow = true;
          child.receiveShadow = true;
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];
          mats.forEach((m) => {
            if (m instanceof THREE.MeshStandardMaterial) {
              steelMaterial(m, child.name);
            }
          });
        });

        // Keep the model's original vertical axis aligned with world Y.
        // The root group rotates only around Y, so the engine stays upright while auto-spinning.
        model.rotation.set(0, INITIAL_MODEL_Y_ROTATION, 0);

        const bounds = fitModel(model);
        ground.position.y = bounds.min.y - 0.02;
        sceneTarget.set(
          0,
          bounds.min.y + (bounds.max.y - bounds.min.y) * 0.45,
          0,
        );
        camera.lookAt(sceneTarget);
        modelRoot.add(model);
      },
      undefined,
      (e) => console.error("[RocketModel] load error:", e),
    );

    // ── Resize ─────────────────────────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(container);
    onResize();

    // ── Render loop ────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    const tick = () => {
      const dt = clock.getDelta();
      if (!prefersReducedMotion) {
        modelRoot.rotation.y += dt * 0.18;
      }
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    tick();

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      dead = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      draco.dispose();
      pmrem.dispose();
      if (model) disposeObject(model);
      envTex?.dispose();
      (ground.material as THREE.ShadowMaterial).dispose();
      ground.geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-label="Interactive 3D rocket engine model"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "560px",
        cursor: "default",
        pointerEvents: "none",
        touchAction: "none",
      }}
    />
  );
}
