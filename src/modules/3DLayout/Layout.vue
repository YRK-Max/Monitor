<template>
  <div ref="test" />
</template>

<script>
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
export default {
  name: 'Layout',
  data() {
    return {
      step: 0,
      renderer: null,
      scene: null,
      camera: null,
      objects: [],
      object: null,
      object2: null,
      selectObj: null
    }
  },
  mounted() {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

    // 渲染器
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    this.renderer.setSize(window.innerWidth - 20, window.innerHeight - 20)
    this.renderer.setClearColor(0xfefefe, 1)
    this.renderer.shadowMap.enabled = true
    this.$refs.test.appendChild(this.renderer.domElement)

    // 场景建设
    const texture_floor = new THREE.TextureLoader().load('static/floor.jpg')
    texture_floor.wrapS = THREE.RepeatWrapping
    texture_floor.wrapT = THREE.RepeatWrapping

    // uv两个方向纹理重复数量
    texture_floor.repeat.set(16, 8)
    const planeMaterial = new THREE.MeshStandardMaterial({
      map: texture_floor, // 设置纹理贴图
      side: THREE.DoubleSide
    })
    const planeGeometry = new THREE.PlaneGeometry(30, 20, 5, 1)
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    plane.rotation.x = -0.5 * Math.PI
    plane.position.x = -2
    plane.position.y = 0
    plane.position.z = 0

    // 相机位置调整
    this.camera.position.x = 30
    this.camera.position.y = 30
    this.camera.position.z = 30
    this.camera.lookAt(this.scene.position)

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x353535) // 环境光
    this.scene.add(ambientLight)
    const spotLight = new THREE.SpotLight(0xfefefe) // 聚光
    spotLight.position.set(4, 17, 2)
    spotLight.castShadow = true

    // 轨迹球
    const controls = new TrackballControls(this.camera, this.renderer.domElement) // 创建场景旋转缩放事件
    controls.rotateSpeed = 2.5
    controls.zoomSpeed = 1.2
    controls.panSpeed = 0.8
    controls.noZoom = false
    controls.noPan = false
    controls.staticMoving = true
    controls.dynamicDampingFactor = 0.3
    setInterval(() => {
      controls.update()
      this.renderer.render(this.scene, this.camera)
    }, 33)

    // 外部模型
    const objLoader = new OBJLoader()
    const that = this
    objLoader.load('static/test.obj', function(obj) {
      const material = new THREE.MeshLambertMaterial({ color: '#00ffff' })
      const group = that.setMacState(obj, material)
      group.scale.set(1.3, 1.3, 1.3)
      group.position.set(4, 0, -4)
      group.name = 'BEN01'
      that.scene.add(group)
    })

    objLoader.load('static/cut.obj', function(obj) {
      const material = new THREE.MeshLambertMaterial({ color: '#00ffff' })
      const group = that.setMacState(obj, material)
      group.scale.set(1.3, 1.3, 1.3)
      group.position.set(-4, -0.2, -4)
      group.name = 'CUT01'
      that.scene.add(group)
    })

    objLoader.load('static/test.obj', function(obj) {
      const material = new THREE.MeshLambertMaterial({ color: '#00ffff' })
      const group = that.setMacState(obj, material)
      group.scale.set(1.3, 1.3, 1.3)
      group.position.set(4, 0, 2)
      group.name = 'BEN02'
      that.scene.add(group)
    })

    objLoader.load('static/cut.obj', function(obj) {
      const material = new THREE.MeshLambertMaterial({ color: '#00ffff' })
      const group = that.setMacState(obj, material)
      group.scale.set(1.3, 1.3, 1.3)
      group.position.set(-4, -0.2, 2)
      group.name = 'CUT02'
      that.scene.add(group)
    })

    this.scene.add(spotLight)
    this.scene.add(plane)

    setTimeout(() => {
      this.renderer.render(this.scene, this.camera)
    }, 500)

    setTimeout(() => {
      const selectedMaterial = new THREE.MeshLambertMaterial({ color: '#3f0fff', name: 'test', opacity: 0.6 })
      const obj = that.scene.getObjectByName('CUT01')
      console.log(obj)
      obj.children.forEach(c => {
        that.setMacState(c, selectedMaterial)
      })
      that.renderer.render(that.scene, that.camera)
    }, 2000)

    document.addEventListener('mouseup', this.onMouseDown)
  },
  methods: {
    onMouseDown(event) {
      // 设置选中颜色
      const selectedMaterial = new THREE.MeshLambertMaterial({ color: '#3bff7a', name: 'selected', opacity: 0.6 })
      const rayCaster = this.getRay(event)
      const intersects = rayCaster.intersectObjects(this.objects)
      if (intersects[0]) {
        console.log(intersects[0])
        this.selectObj = intersects[0].object
        this.selectObj.material = selectedMaterial
      }
      this.renderer.render(this.scene, this.camera)
    },
    getRay(event) {
      event.preventDefault()
      const mouse = new THREE.Vector2()
      const rayCaster = new THREE.Raycaster()
      const rect = this.renderer.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      rayCaster.setFromCamera(mouse, this.camera)
      return rayCaster
    },
    setMacState(obj, material) {
      const group = new THREE.Object3D()
      const that = this
      obj.traverse(function(child) {
        if (child instanceof THREE.Mesh) {
          child.material = material
          const mesh = new THREE.Mesh(child.geometry, child.material)
          mesh.castShadow = true
          that.objects.push(mesh)
          group.add(mesh)
        }
      })
      return group
    }
  }
}
</script>

<style scoped>

</style>
