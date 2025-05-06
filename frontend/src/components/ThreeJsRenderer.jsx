"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { saveAs } from "file-saver"
import html2canvas from "html2canvas"

const ThreeJsRenderer = ({ data, xAxis, yAxis, title }) => {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && data && data.length > 0) {
      // Initialize scene
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0xf0f0f0)
      sceneRef.current = scene

      // Initialize renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      containerRef.current.appendChild(renderer.domElement)
      rendererRef.current = renderer

      // Initialize camera
      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000,
      )
      camera.position.set(5, 5, 5)
      cameraRef.current = camera

      // Initialize controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.25
      controls.screenSpacePanning = false
      controls.maxPolarAngle = Math.PI / 2
      controlsRef.current = controls

      // Add lights
      const ambientLight = new THREE.AmbientLight(0x404040)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
      directionalLight.position.set(1, 1, 1)
      scene.add(directionalLight)

      // Add grid
      const gridHelper = new THREE.GridHelper(10, 10)
      scene.add(gridHelper)

      // Add axes
      const axesHelper = new THREE.AxesHelper(5)
      scene.add(axesHelper)

      // Extract data for the selected axes
      const values = data.map((item) => ({
        x: data.indexOf(item),
        y: Number.parseFloat(item[yAxis]),
        label: item[xAxis],
      }))

      // Create 3D bars
      const barGroup = new THREE.Group()
      scene.add(barGroup)

      const maxValue = Math.max(...values.map((v) => v.y))
      const barWidth = 0.5
      const spacing = 0.2

      values.forEach((value, index) => {
        const normalizedHeight = (value.y / maxValue) * 5 // Scale to a reasonable height
        const geometry = new THREE.BoxGeometry(barWidth, normalizedHeight, barWidth)
        const material = new THREE.MeshLambertMaterial({
          color: new THREE.Color(0.4, 0.6, 0.8),
        })
        const bar = new THREE.Mesh(geometry, material)

        // Position the bar
        bar.position.x = index * (barWidth + spacing) - (values.length * (barWidth + spacing)) / 2
        bar.position.y = normalizedHeight / 2

        barGroup.add(bar)
      })

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
      }
      animate()

      // Handle window resize
      const handleResize = () => {
        if (containerRef.current && cameraRef.current && rendererRef.current) {
          const width = containerRef.current.clientWidth
          const height = containerRef.current.clientHeight

          cameraRef.current.aspect = width / height
          cameraRef.current.updateProjectionMatrix()

          rendererRef.current.setSize(width, height)
        }
      }
      window.addEventListener("resize", handleResize)

      // Cleanup function
      return () => {
        window.removeEventListener("resize", handleResize)
        if (containerRef.current && rendererRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }
        scene.clear()
      }
    }
  }, [data, xAxis, yAxis])

  const downloadScreenshot = () => {
    if (rendererRef.current) {
      html2canvas(rendererRef.current.domElement).then((canvas) => {
        canvas.toBlob((blob) => {
          saveAs(blob, `${title || "3d-chart"}.png`)
        })
      })
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">{title || `3D Visualization: ${yAxis} by ${xAxis}`}</h3>
      <div ref={containerRef} className="three-container"></div>
      <div className="flex justify-end mt-4">
        <button onClick={downloadScreenshot} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          Download Screenshot
        </button>
      </div>
    </div>
  )
}

export default ThreeJsRenderer
