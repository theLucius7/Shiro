'use client'

import { useTheme } from 'next-themes'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import { useIsClient } from '~/hooks/common/use-is-client'

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const lerp = (start: number, end: number, alpha: number) =>
  start + (end - start) * alpha

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min

const createRenderer = (width: number, height: number) => {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(width, height)
  renderer.setClearColor(0x000000, 0)
  return renderer
}

const createCamera = (width: number, height: number) => {
  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000)
  camera.position.z = 600
  return camera
}

const normalizePointer = (event: PointerEvent, rect: DOMRect) => {
  const x = event.clientX - rect.left - rect.width / 2
  const y = -(event.clientY - rect.top - rect.height / 2)
  return { x, y }
}

export const ParticleSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let width = container.clientWidth
    let height = container.clientHeight

    const scene = new THREE.Scene()
    const camera = createCamera(width, height)
    const renderer = createRenderer(width, height)
    container.append(renderer.domElement)

    const clock = new THREE.Clock()

    const particleCount = clamp(Math.floor((width * height) / 900), 1400, 3200)
    const positions = new Float32Array(particleCount * 3)
    const origins = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 2.1,
      transparent: true,
      opacity: 0.7,
      vertexColors: true,
      depthWrite: false,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const resetParticles = () => {
      const exclusionHalf = Math.min(450, width / 2 - 40)
      for (let i = 0; i < particleCount; i += 1) {
        const idx = i * 3
        let x = randomBetween(-width / 2, width / 2)
        if (Math.random() < 0.8 && exclusionHalf > 20) {
          const leftSide = Math.random() < 0.5
          x = leftSide
            ? randomBetween(-width / 2, -exclusionHalf)
            : randomBetween(exclusionHalf, width / 2)
        }
        const y = randomBetween(-height / 2, height / 2)
        const z = randomBetween(-200, 200)
        positions[idx] = x
        positions[idx + 1] = y
        positions[idx + 2] = z
        origins[idx] = x
        origins[idx + 1] = y
        origins[idx + 2] = z
        velocities[idx] = 0
        velocities[idx + 1] = 0
        velocities[idx + 2] = 0
        const brightness = randomBetween(0.6, 1)
        colors[idx] = 0.6 * brightness
        colors[idx + 1] = 0.7 * brightness
        colors[idx + 2] = 0.9 * brightness
      }
      geometry.attributes.position.needsUpdate = true
      geometry.attributes.color.needsUpdate = true
    }

    resetParticles()

    let lastScrollY = window.scrollY
    let scrollVelocity = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      scrollVelocity = currentScrollY - lastScrollY
      lastScrollY = currentScrollY
    }

    const handleResize = () => {
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      resetParticles()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    const animate = () => {
      const delta = clock.getDelta() * 60
      const shouldLerp = Math.abs(scrollVelocity) < 0.1

      for (let i = 0; i < particleCount; i += 1) {
        const idx = i * 3
        velocities[idx + 1] += scrollVelocity * 0.025

        positions[idx] += velocities[idx] * delta
        positions[idx + 1] += velocities[idx + 1] * delta
        positions[idx + 2] += velocities[idx + 2] * delta

        velocities[idx] *= 0.85
        velocities[idx + 1] *= 0.85
        velocities[idx + 2] *= 0.85

        if (shouldLerp) {
          positions[idx] = lerp(positions[idx], origins[idx], 0.02)
          positions[idx + 1] = lerp(positions[idx + 1], origins[idx + 1], 0.02)
          positions[idx + 2] = lerp(positions[idx + 2], origins[idx + 2], 0.02)
        }

        if (positions[idx + 1] < -height / 2 - 120) {
          positions[idx + 1] = height / 2 + 120
        } else if (positions[idx + 1] > height / 2 + 120) {
          positions[idx + 1] = -height / 2 - 120
        }
      }

      scrollVelocity *= 0.9

      geometry.attributes.position.needsUpdate = true
      renderer.render(scene, camera)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="size-full" />
}

export const SnowSystem = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let width = container.clientWidth
    let height = container.clientHeight

    const scene = new THREE.Scene()
    const camera = createCamera(width, height)
    const renderer = createRenderer(width, height)
    container.append(renderer.domElement)

    const clock = new THREE.Clock()

    const particleCount = clamp(Math.floor((width * height) / 1100), 1000, 2400)
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const textureCanvas = document.createElement('canvas')
    textureCanvas.width = 32
    textureCanvas.height = 32
    const ctx = textureCanvas.getContext('2d')
    if (ctx) {
      ctx.clearRect(0, 0, 32, 32)
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.beginPath()
      for (let i = 0; i < 6; i += 1) {
        const angle = (Math.PI / 3) * i - Math.PI / 6
        const x = 16 + Math.cos(angle) * 11
        const y = 16 + Math.sin(angle) * 11
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(textureCanvas)

    const material = new THREE.PointsMaterial({
      size: 6,
      map: texture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const resetParticles = () => {
      for (let i = 0; i < particleCount; i += 1) {
        const idx = i * 3
        const x = randomBetween(-width / 2, width / 2)
        const y = randomBetween(-height / 2, height / 2)
        const z = randomBetween(-300, 120)
        positions[idx] = x
        positions[idx + 1] = y
        positions[idx + 2] = z
        velocities[idx] = randomBetween(-0.05, 0.05)
        velocities[idx + 1] = randomBetween(-0.15, -0.6)
        velocities[idx + 2] = 0
        const brightness = clamp((z + 300) / 420, 0.35, 1)
        colors[idx] = brightness
        colors[idx + 1] = brightness
        colors[idx + 2] = brightness
      }
      geometry.attributes.position.needsUpdate = true
      geometry.attributes.color.needsUpdate = true
    }

    resetParticles()

    const handleResize = () => {
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      resetParticles()
    }

    window.addEventListener('resize', handleResize)

    const animate = () => {
      const delta = clock.getDelta() * 60
      const time = clock.elapsedTime

      for (let i = 0; i < particleCount; i += 1) {
        const idx = i * 3
        const z = positions[idx + 2]
        const turbulence =
          Math.sin(time + positions[idx] * 0.01 + z * 0.02) * 0.15
        velocities[idx] += 0.01 + turbulence
        velocities[idx + 1] -= 0.02

        positions[idx] += velocities[idx] * delta
        positions[idx + 1] += velocities[idx + 1] * delta

        velocities[idx] *= 0.96
        velocities[idx + 1] *= 0.98

        if (positions[idx + 1] < -height / 2 - 40) {
          positions[idx + 1] = height / 2 + 40
          positions[idx] = randomBetween(-width / 2, width / 2)
          velocities[idx] = randomBetween(-0.05, 0.05)
          velocities[idx + 1] = randomBetween(-0.2, -0.6)
        }

        if (positions[idx] > width / 2 + 40) positions[idx] = -width / 2 - 40
        if (positions[idx] < -width / 2 - 40) positions[idx] = width / 2 + 40
      }

      geometry.attributes.position.needsUpdate = true
      renderer.render(scene, camera)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="size-full" />
}

export const FireflySystem = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let width = container.clientWidth
    let height = container.clientHeight

    const scene = new THREE.Scene()
    const camera = createCamera(width, height)
    const renderer = createRenderer(width, height)
    container.append(renderer.domElement)

    const clock = new THREE.Clock()

    const particleCount = clamp(Math.floor((width * height) / 1400), 700, 1600)
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const baseColors = new Float32Array(particleCount * 3)
    const phases = new Float32Array(particleCount)

    const palette = [
      new THREE.Color('#c7ff6b'),
      new THREE.Color('#6dff8a'),
      new THREE.Color('#8fd8ff'),
    ]

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 5,
      transparent: true,
      opacity: 0.9,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const resetParticles = () => {
      for (let i = 0; i < particleCount; i += 1) {
        const idx = i * 3
        positions[idx] = randomBetween(-width / 2, width / 2)
        positions[idx + 1] = randomBetween(-height / 2, height / 2)
        positions[idx + 2] = randomBetween(-120, 120)
        velocities[idx] = randomBetween(-0.04, 0.04)
        velocities[idx + 1] = randomBetween(-0.04, 0.04)
        velocities[idx + 2] = 0
        const color = palette[Math.floor(Math.random() * palette.length)]
        baseColors[idx] = color.r
        baseColors[idx + 1] = color.g
        baseColors[idx + 2] = color.b
        colors[idx] = color.r
        colors[idx + 1] = color.g
        colors[idx + 2] = color.b
        phases[i] = randomBetween(0, Math.PI * 2)
      }
      geometry.attributes.position.needsUpdate = true
      geometry.attributes.color.needsUpdate = true
    }

    resetParticles()

    let pointer = { x: 0, y: 0, active: false }
    let clickBoost = 0

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer = { ...normalizePointer(event, rect), active: true }
    }

    const handlePointerLeave = () => {
      pointer = { ...pointer, active: false }
    }

    const handleClick = () => {
      clickBoost = 1
    }

    renderer.domElement.addEventListener('pointermove', handlePointerMove)
    renderer.domElement.addEventListener('pointerleave', handlePointerLeave)
    renderer.domElement.addEventListener('click', handleClick)

    const handleResize = () => {
      width = container.clientWidth
      height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      resetParticles()
    }

    window.addEventListener('resize', handleResize)

    const animate = () => {
      const delta = clock.getDelta() * 60
      const time = clock.elapsedTime
      const threshold = 140
      const repelStrength = 0.4 + clickBoost * 0.8

      for (let i = 0; i < particleCount; i += 1) {
        const idx = i * 3
        const driftX =
          Math.sin(time * 0.6 + phases[i]) * 0.2 +
          Math.sin(time * 0.2 + phases[i] * 2) * 0.15
        const driftY = Math.cos(time * 0.5 + phases[i]) * 0.2

        velocities[idx] += driftX * 0.02
        velocities[idx + 1] += driftY * 0.02

        if (pointer.active) {
          const dx = positions[idx] - pointer.x
          const dy = positions[idx + 1] - pointer.y
          const dist = Math.hypot(dx, dy)
          if (dist < threshold && dist > 0.01) {
            const force = ((threshold - dist) / threshold) * repelStrength
            velocities[idx] += (dx / dist) * force
            velocities[idx + 1] += (dy / dist) * force
          }
        }

        positions[idx] += velocities[idx] * delta
        positions[idx + 1] += velocities[idx + 1] * delta

        velocities[idx] *= 0.9
        velocities[idx + 1] *= 0.9

        if (positions[idx] > width / 2 + 60) positions[idx] = -width / 2 - 60
        if (positions[idx] < -width / 2 - 60) positions[idx] = width / 2 + 60
        if (positions[idx + 1] > height / 2 + 60)
          positions[idx + 1] = -height / 2 - 60
        if (positions[idx + 1] < -height / 2 - 60)
          positions[idx + 1] = height / 2 + 60

        const pulse = 0.5 + 0.5 * Math.sin(time * 2 + phases[i])
        const intensity = 0.35 + pulse * 0.65
        colors[idx] = baseColors[idx] * intensity
        colors[idx + 1] = baseColors[idx + 1] * intensity
        colors[idx + 2] = baseColors[idx + 2] * intensity
      }

      clickBoost *= 0.9
      geometry.attributes.position.needsUpdate = true
      geometry.attributes.color.needsUpdate = true
      renderer.render(scene, camera)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('pointermove', handlePointerMove)
      renderer.domElement.removeEventListener(
        'pointerleave',
        handlePointerLeave,
      )
      renderer.domElement.removeEventListener('click', handleClick)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className="size-full" />
}

export type BackgroundMode = 'auto' | 'physics' | 'snow' | 'fireflies'

export const BackgroundManager = ({
  mode = 'auto',
}: {
  mode?: BackgroundMode
}) => {
  const isClient = useIsClient()
  const { resolvedTheme } = useTheme()
  const [randomMode, setRandomMode] = useState<'physics' | 'fireflies'>(
    'physics',
  )

  useEffect(() => {
    setRandomMode(Math.random() > 0.5 ? 'physics' : 'fireflies')
  }, [])

  const currentMode = useMemo(() => {
    if (!isClient) return 'physics'
    if (mode !== 'auto') return mode
    const month = new Date().getMonth()
    const isWinter = month === 11 || month === 0 || month === 1
    const isDark = resolvedTheme === 'dark'
    if (isWinter && isDark) return 'snow'
    return randomMode
  }, [isClient, mode, randomMode, resolvedTheme])

  if (!isClient) return null

  const enablePointerEvents = currentMode === 'fireflies'

  return (
    <div
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: enablePointerEvents ? 'auto' : 'none' }}
      aria-hidden
    >
      {currentMode === 'snow' && <SnowSystem />}
      {currentMode === 'physics' && <ParticleSystem />}
      {currentMode === 'fireflies' && <FireflySystem />}
    </div>
  )
}

export default BackgroundManager
