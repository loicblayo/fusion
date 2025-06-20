document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('holds-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(canvas.clientWidth, 400, false);

  // Scene & camera
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff); // Fond blanc
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / 400, 0.1, 1000);
  camera.position.set(0, 0, 10);

  scene.add(new THREE.AmbientLight(0x404040));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(2, 2, 5);
  scene.add(dirLight);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // ---- Presets de formes (bibliothèque) ----
  const presets = {
    ball:    { shape: "sphere", radius: 3, rugosite: 0.05 },
    sloper:  { shape: "galet", length: 6, height: 2.5, flatten: 1.2, rugosite: 0.15 },
    edge:    { shape: "cube", width: 8, height: 2, depth: 2, rugosite: 0.12 },
    crimp:   { shape: "cube", width: 6, height: 1, depth: 2, rugosite: 0.1 },
    pinch:   { shape: "cube", width: 3, height: 5, depth: 3, rugosite: 0.16 },
    jug:     { shape: "cube", width: 6, height: 5, depth: 5, rugosite: 0.12 },
    miniJug: { shape: "cube", width: 3, height: 2, depth: 2, rugosite: 0.09 },
    pocket:  { shape: "sphere", radius: 3, rugosite: 0.2, pocket: true },
    blob:    { shape: "galet", length: 5, height: 3, flatten: 1.8, rugosite: 0.18 },
    hoof:    { shape: "galet", length: 4, height: 3.5, flatten: 1.5, rugosite: 0.12 }
  };

  let mesh, geometry, vertexHelpers = [], modeLibre = false;
  let currentShape = "cube";
  let params = { width: 5, height: 5, depth: 5, radius: 2.5, length: 5, flatten: 1, rugosite: 0 };
  let noise = new SimplexNoise();
  let pocketMode = false;

  // UI
  const shapeSelect = document.getElementById('shape');
  const paramControls = document.getElementById('param-controls');
  const rugositeSlider = document.getElementById('rugosite');
  const rugositeValue = document.getElementById('rugosite-value');
  const modeLibreBtn = document.getElementById('mode-libre-btn');
  const modeLibreLabel = document.getElementById('mode-libre-label');
  const flattenBtn = document.getElementById('flatten-btn');
  const presetSelect = document.getElementById('preset');
  const pocketCheckbox = document.getElementById('pocket');
  rugositeValue.innerText = rugositeSlider.value;

  // --- Preset / Bibliothèque ---
  presetSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (presets[val]) {
      Object.keys(presets[val]).forEach(k => {
        params[k] = presets[val][k];
      });
      pocketMode = !!presets[val].pocket;
      pocketCheckbox.checked = pocketMode;
      shapeSelect.value = presets[val].shape || "cube";
      updateParamControls();
      Array.from(paramControls.querySelectorAll("input")).forEach(input => {
        if(params[input.id] !== undefined) input.value = params[input.id];
      });
      rugositeSlider.value = params.rugosite || 0;
      rugositeValue.innerText = rugositeSlider.value;
      createShape();
    }
  });

  // --- Pocket checkbox
  pocketCheckbox.addEventListener('change', (e) => {
    pocketMode = pocketCheckbox.checked;
    createShape();
  });

  function updateParamControls() {
    paramControls.innerHTML = '';
    if (currentShape === "cube" || currentShape === "pyramid") {
      paramControls.innerHTML += `
        <label>Largeur :<input type="number" id="width" min="1" max="20" step="0.1" value="${params.width}" style="width:50px;margin-left:2px;margin-right:12px;"></label>
        <label>Hauteur :<input type="number" id="height" min="1" max="20" step="0.1" value="${params.height}" style="width:50px;margin-left:2px;margin-right:12px;"></label>
        <label>Profondeur :<input type="number" id="depth" min="1" max="20" step="0.1" value="${params.depth}" style="width:50px;margin-left:2px;"></label>
      `;
    } else if (currentShape === "sphere") {
      paramControls.innerHTML += `<label>Rayon :<input type="number" id="radius" min="1" max="20" step="0.1" value="${params.radius}" style="width:50px;margin-left:2px;"></label>`;
    } else if (currentShape === "cylinder" || currentShape === "cone") {
      paramControls.innerHTML += `
        <label>Rayon base :<input type="number" id="radius" min="0.5" max="20" step="0.1" value="${params.radius}" style="width:50px;margin-left:2px;margin-right:12px;"></label>
        <label>Hauteur :<input type="number" id="height" min="1" max="20" step="0.1" value="${params.height}" style="width:50px;margin-left:2px;"></label>
      `;
    } else if (currentShape === "prism") {
      paramControls.innerHTML += `
        <label>Base :<input type="number" id="base" min="1" max="20" step="0.1" value="${params.base || 5}" style="width:50px;margin-left:2px;margin-right:12px;"></label>
        <label>Hauteur :<input type="number" id="height" min="1" max="20" step="0.1" value="${params.height}" style="width:50px;margin-left:2px;"></label>
        <label>Profondeur :<input type="number" id="depth" min="1" max="20" step="0.1" value="${params.depth}" style="width:50px;margin-left:2px;"></label>
      `;
    } else if (currentShape === "galet") {
      paramControls.innerHTML += `
        <label>Longueur :<input type="number" id="length" min="1" max="20" step="0.1" value="${params.length}" style="width:50px;margin-left:2px;margin-right:12px;"></label>
        <label>Épaisseur :<input type="number" id="height" min="0.5" max="10" step="0.1" value="${params.height}" style="width:50px;margin-left:2px;margin-right:12px;"></label>
        <label>Aplatissement :<input type="number" id="flatten" min="0.5" max="2" step="0.01" value="${params.flatten}" style="width:50px;margin-left:2px;"></label>
      `;
    }
    Array.from(paramControls.querySelectorAll("input")).forEach(input => {
      input.addEventListener("input", (e) => {
        params[input.id] = parseFloat(e.target.value);
        createShape();
      });
    });
  }

  function createShape() {
    if (currentShape !== "cube" && modeLibre) setModeLibre(false);
    if (mesh) { scene.remove(mesh); mesh.geometry.dispose(); }
    params.rugosite = parseFloat(rugositeSlider.value);

    switch (currentShape) {
      case "cube":
        geometry = new THREE.BoxGeometry(params.width, params.height, params.depth, 32, 32, 32);
        break;
      case "sphere":
        geometry = new THREE.SphereGeometry(params.radius, 48, 24);
        break;
      case "cylinder":
        geometry = new THREE.CylinderGeometry(params.radius, params.radius, params.height, 48, 8, false);
        break;
      case "cone":
        geometry = new THREE.ConeGeometry(params.radius, params.height, 32, 8, false);
        break;
      case "pyramid":
        geometry = new THREE.ConeGeometry(params.width / 2, params.height, 4, 1, false);
        break;
      case "prism":
        geometry = createPrismGeometry(params.base || 5, params.height, params.depth);
        break;
      case "galet":
        geometry = createGaletGeometry(params.length, params.height, params.flatten || 1);
        break;
      default:
        geometry = new THREE.BoxGeometry(5, 5, 5, 32, 32, 32);
    }
    if (params.rugosite > 0.01 && !modeLibre) applyRugosite(geometry, params.rugosite);
    if (pocketMode && (currentShape === "sphere" || currentShape === "galet")) {
      applyPocket(geometry, currentShape);
    }
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: 0xFFD600 }));
    scene.add(mesh);
    if (currentShape === "cube" && modeLibre) {
      createVertexHelpers();
    } else {
      removeVertexHelpers();
    }
  }

  // --- Pocket (trou central) pour sphère/galet ---
  function applyPocket(geometry, type) {
    const pos = geometry.attributes.position;
    const center = new THREE.Vector3(0, 0, -Infinity);
    for (let i = 0; i < pos.count; i++) {
      if (pos.getZ(i) > center.z) center.z = pos.getZ(i); // Cherche le point "le plus haut"
    }
    // Rayon du trou
    const radius = type === "sphere" ? (params.radius * 0.35) : (params.length * 0.20);
    for (let i = 0; i < pos.count; i++) {
      // Crée un trou sur la face supérieure
      if (pos.getZ(i) > center.z - 0.15) {
        const d = Math.sqrt(pos.getX(i)**2 + pos.getY(i)**2);
        if (d < radius) {
          pos.setZ(i, pos.getZ(i) - 0.6 * (1 - d/radius));
        }
      }
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  }

  function flattenBottomFaceManual() {
    if (!mesh || !mesh.geometry) return;
    const pos = mesh.geometry.attributes.position;
    let minZ = +Infinity;
    for (let i = 0; i < pos.count; i++) {
      if (pos.getZ(i) < minZ) minZ = pos.getZ(i);
    }
    const tol = 0.05;
    for (let i = 0; i < pos.count; i++) {
      if (Math.abs(pos.getZ(i) - minZ) < tol) {
        pos.setZ(i, minZ);
      }
    }
    pos.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
  }

  function createGaletGeometry(length = 6, height = 2, flatten = 1) {
    const points = [];
    const N = 30;
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const r = (Math.sin(Math.PI * t) ** flatten) * (length / 2);
      const z = (t - 0.5) * height;
      points.push(new THREE.Vector2(r, z));
    }
    return new THREE.LatheGeometry(points, 64);
  }

  function createPrismGeometry(base = 5, height = 5, depth = 5) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(base, 0);
    shape.lineTo(base / 2, Math.sqrt(3) / 2 * base);
    shape.lineTo(0, 0);
    const extrudeSettings = { steps: 1, depth: depth, bevelEnabled: false };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.rotateX(Math.PI / 2);
    geo.scale(1, height / base, 1);
    geo.center();
    return geo;
  }

  function applyRugosite(geometry, strength) {
    const pos = geometry.attributes.position;
    let minZ = +Infinity;
    for (let i = 0; i < pos.count; i++) if (pos.getZ(i) < minZ) minZ = pos.getZ(i);
    const tol = 0.05;
    for (let i = 0; i < pos.count; i++) {
      if (Math.abs(pos.getZ(i) - minZ) < tol) continue;
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      const noiseValue = noise.noise3D(v.x * 0.2, v.y * 0.2, v.z * 0.2);
      v.addScaledVector(v.clone().normalize(), noiseValue * strength);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  }

  // --------- MODE LIBRE ---------
  function createVertexHelpers() {
    removeVertexHelpers();
    geometry = mesh.geometry;
    const pos = geometry.attributes.position;
    let uniqueVerts = [];
    let minZ = +Infinity;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      if (!uniqueVerts.some(u => u.distanceTo(v) < 0.01)) uniqueVerts.push(v);
      if (pos.getZ(i) < minZ) minZ = pos.getZ(i);
    }
    const tol = 0.05;
    uniqueVerts.forEach((v, idx) => {
      if (Math.abs(v.z - minZ) < tol) return;
      const helperGeom = new THREE.SphereGeometry(0.22, 16, 16);
      const helperMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const helper = new THREE.Mesh(helperGeom, helperMat);
      helper.position.copy(v);
      helper.userData.vertexIndex = idx;
      scene.add(helper);
      vertexHelpers.push(helper);
    });
  }

  function removeVertexHelpers() {
    vertexHelpers.forEach(h => scene.remove(h));
    vertexHelpers = [];
  }

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let selectedHelper = null;
  let dragOffset = new THREE.Vector3();

  function getMouseNDCCoords(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  canvas.addEventListener('pointerdown', (event) => {
    if (!modeLibre) return;
    getMouseNDCCoords(event);
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(vertexHelpers);
    if (intersects.length > 0) {
      selectedHelper = intersects[0].object;
      controls.enabled = false;
      dragOffset.copy(intersects[0].point).sub(selectedHelper.position);
    }
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!modeLibre || !selectedHelper) return;
    getMouseNDCCoords(event);
    raycaster.setFromCamera(mouse, camera);
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion), selectedHelper.position.dot(new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion)));
    const intersect = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeZ, intersect);
    if (intersect) {
      selectedHelper.position.copy(intersect.sub(dragOffset));
      updateCubeGeometryFromHelpers();
    }
  });

  window.addEventListener('pointerup', () => {
    if (selectedHelper) {
      controls.enabled = true;
      selectedHelper = null;
    }
  });

  function updateCubeGeometryFromHelpers() {
    const pos = geometry.attributes.position;
    let uniqueVerts = [];
    let minZ = +Infinity;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
      if (!uniqueVerts.some(u => u.distanceTo(v) < 0.01)) uniqueVerts.push(v);
      if (pos.getZ(i) < minZ) minZ = pos.getZ(i);
    }
    const tol = 0.05;
    for (let i = 0; i < pos.count; i++) {
      for (let j = 0; j < uniqueVerts.length; j++) {
        if (new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)).distanceTo(uniqueVerts[j]) < 0.01) {
          if (Math.abs(uniqueVerts[j].z - minZ) < tol) {
            pos.setZ(i, minZ);
          } else {
            pos.setXYZ(i,
              vertexHelpers[j - planeVertexCount(uniqueVerts, minZ, tol)].position.x,
              vertexHelpers[j - planeVertexCount(uniqueVerts, minZ, tol)].position.y,
              vertexHelpers[j - planeVertexCount(uniqueVerts, minZ, tol)].position.z
            );
          }
        }
      }
    }
    pos.needsUpdate = true;
    geometry.computeVertexNormals();
  }

  function planeVertexCount(uniqueVerts, minZ, tol) {
    return uniqueVerts.filter(v => Math.abs(v.z - minZ) < tol).length;
  }

  modeLibreBtn.addEventListener('click', () => {
    if (currentShape === "cube") setModeLibre(!modeLibre);
  });
  function setModeLibre(val) {
    modeLibre = val;
    modeLibreBtn.style.background = modeLibre ? "#ddd" : "";
    modeLibreLabel.style.display = modeLibre ? "inline" : "none";
    createShape();
  }

  shapeSelect.addEventListener("change", (e) => {
    currentShape = e.target.value;
    updateParamControls();
    createShape();
  });
  rugositeSlider.addEventListener("input", () => {
    rugositeValue.innerText = rugositeSlider.value;
    if (!modeLibre) createShape();
  });

  flattenBtn.addEventListener('click', () => {
    flattenBottomFaceManual();
  });

  window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / 400;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, 400, false);
  });

  async function sendSTLToServer(stlString) {
    const response = await fetch(holdsConf.ajax_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: new URLSearchParams({
        action: 'save_stl',
        nonce: holdsConf.nonce,
        stl: stlString
      })
    });
    return response.json();
  }

  document.getElementById('export-btn').addEventListener('click', () => {
    const exporter = new THREE.STLExporter();
    const stlString = exporter.parse(mesh);
    sendSTLToServer(stlString).then(result => {
      if (result.success) {
        alert('STL saved at ' + result.data.url);
      } else {
        alert('Error saving STL');
      }
    });
  });

  updateParamControls();
  createShape();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
});
