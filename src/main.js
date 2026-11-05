import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 1. Escena 3D
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xdfe9f3)

// 2. Càmera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 2, 5)

// 3. Renderitzador
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
document.querySelector('#app').appendChild(renderer.domElement)

// 4. Il·luminació
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1)
hemiLight.position.set(0, 20, 0)
scene.add(hemiLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(5, 10, 7.5)
scene.add(directionalLight)

// 5. Controls de rotació amb el ratolí
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05

// 6. Carregador del model 3D (tree.glb, format GLTF/GLB)
const loader = new GLTFLoader()
loader.load(
  '/tree.glb',
  (gltf) => {
    const model = gltf.scene

    // Centrar i escalar el model perquè càpiga a la vista
    const box = new THREE.Box3().setFromObject(model)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 3 / maxDim

    model.scale.setScalar(scale)
    model.position.sub(center.multiplyScalar(scale))

    scene.add(model)

    camera.position.set(0, 1.5, 5)
    controls.target.set(0, 0, 0)
    controls.update()
  },
  (xhr) => {
    if (xhr.total) {
      console.log(`Carregant model: ${((xhr.loaded / xhr.total) * 100).toFixed(0)}%`)
    }
  },
  (error) => {
    console.error('Error carregant el model:', error)
  }
)

// Adaptar a la mida de la finestra
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Bucle d'animació
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()
