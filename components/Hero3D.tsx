'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function createRenderer(): THREE.WebGLRenderer | null {
  try {
    return new THREE.WebGLRenderer({ antialias: true, alpha: true })
  } catch {
    return null
  }
}

export default function Hero3D({ onFail }: { onFail: () => void }) {
  const mount = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mount.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onFail()
      return
    }
    const renderer = createRenderer()
    if (!renderer) {
      onFail()
      return
    }

    const small = window.innerWidth < 768
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2))
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.z = 7

    scene.add(new THREE.AmbientLight(0xffffff, 0.9))
    const key = new THREE.DirectionalLight(0xffffff, 2.2)
    key.position.set(3, 4, 5)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xe879f9, 1.6)
    rim.position.set(-4, -2, -3)
    scene.add(rim)

    const group = new THREE.Group()
    scene.add(group)

    const knotGeo = new THREE.TorusKnotGeometry(1.15, 0.36, 180, 28)
    const knotMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.35, roughness: 0.3 })
    const knot = new THREE.Mesh(knotGeo, knotMat)
    group.add(knot)

    const shellGeo = new THREE.IcosahedronGeometry(2.3, 1)
    const shellMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.3 })
    const shell = new THREE.Mesh(shellGeo, shellMat)
    group.add(shell)

    const count = small ? 250 : 600
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    const dotsGeo = new THREE.BufferGeometry()
    dotsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const dotsMat = new THREE.PointsMaterial({ color: 0x818cf8, size: 0.045, transparent: true, opacity: 0.8 })
    const dots = new THREE.Points(dotsGeo, dotsMat)
    scene.add(dots)

    const resize = () => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    let mx = 0, my = 0, tx = 0, ty = 0
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2
      my = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouse)

    let visible = true
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    io.observe(el)

    const start = performance.now()
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!visible) return
      const t = (performance.now() - start) / 1000
      tx += (mx - tx) * 0.05
      ty += (my - ty) * 0.05
      const scroll = window.scrollY * 0.004
      knot.rotation.x = t * 0.25 + ty * 0.6 + scroll
      knot.rotation.y = t * 0.35 + tx * 0.8 + scroll
      shell.rotation.y = -t * 0.12 + tx * 0.3
      shell.rotation.x = t * 0.08
      dots.rotation.y = t * 0.03 + scroll * 0.5
      group.position.y = Math.sin(t * 0.9) * 0.15
      renderer.render(scene, camera)
    }
    resize()
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouse)
      ro.disconnect()
      io.disconnect()
      knotGeo.dispose(); knotMat.dispose()
      shellGeo.dispose(); shellMat.dispose()
      dotsGeo.dispose(); dotsMat.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
    }
  }, [onFail])

  return <div ref={mount} className="h-full w-full" />
}