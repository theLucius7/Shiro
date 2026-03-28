'use client'

import { useEffect, useRef } from 'react'

import { useIsDark } from '~/hooks/common/use-is-dark'

type PetalPalette = {
  base: string
  mid: string
  tip: string
  edge: string
  vein: string
  glow: string
}

type Petal = {
  baseSize: number
  drift: number
  fallSpeed: number
  lengthScale: number
  notch: number
  opacity: number
  paletteIndex: number
  rotation: number
  rotationVelocity: number
  seed: number
  swayPhase: number
  tilt: number
  tiltVelocity: number
  veinAlpha: number
  widthScale: number
  x: number
  y: number
  z: number
}

const LIGHT_PALETTE: PetalPalette[] = [
  {
    base: '#fff8f9',
    mid: '#f8dce4',
    tip: '#f0b9c7',
    edge: 'rgba(235, 167, 186, 0.72)',
    vein: 'rgba(255, 255, 255, 0.82)',
    glow: 'rgba(255, 225, 234, 0.4)',
  },
  {
    base: '#fff5f8',
    mid: '#f7d6e0',
    tip: '#eeb1c4',
    edge: 'rgba(228, 156, 182, 0.68)',
    vein: 'rgba(255, 255, 255, 0.78)',
    glow: 'rgba(255, 224, 236, 0.36)',
  },
  {
    base: '#fff7fa',
    mid: '#f6d9e6',
    tip: '#ecbfd2',
    edge: 'rgba(234, 174, 198, 0.62)',
    vein: 'rgba(255, 255, 255, 0.8)',
    glow: 'rgba(255, 235, 242, 0.34)',
  },
]

const DARK_PALETTE: PetalPalette[] = [
  {
    base: '#f7e7ed',
    mid: '#dcbecb',
    tip: '#bc95a9',
    edge: 'rgba(193, 152, 175, 0.48)',
    vein: 'rgba(255, 246, 250, 0.52)',
    glow: 'rgba(255, 214, 231, 0.16)',
  },
  {
    base: '#f3e2ea',
    mid: '#d5b7c7',
    tip: '#b488a0',
    edge: 'rgba(187, 144, 169, 0.42)',
    vein: 'rgba(255, 244, 248, 0.48)',
    glow: 'rgba(255, 205, 223, 0.14)',
  },
  {
    base: '#efe0e8',
    mid: '#cfb2c3',
    tip: '#ab809a',
    edge: 'rgba(178, 137, 162, 0.4)',
    vein: 'rgba(255, 239, 246, 0.46)',
    glow: 'rgba(255, 209, 228, 0.12)',
  },
]

const MIN_DEPTH = 0.52
const MAX_DEPTH = 1.7

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value))
}

export const SakuraBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDark = useIsDark()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
    const reducedMotionLegacyApi = prefersReducedMotion as MediaQueryList & {
      addListener?: (listener: () => void) => void
      removeListener?: (listener: () => void) => void
    }

    const petals: Petal[] = []
    const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE

    let animationFrame = 0
    let reducedMotion = prefersReducedMotion.matches
    let width = 0
    let height = 0
    let lastFrame = performance.now()

    const resizeCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const getPetalCount = () => {
      const area = width * height
      const isMobile = width < 768

      if (reducedMotion) {
        return clamp(Math.round(area / 135_000), 8, isMobile ? 12 : 18)
      }

      const target = Math.round((area / 32_000) * (isMobile ? 0.62 : 1))
      return clamp(target, isMobile ? 16 : 30, isMobile ? 28 : 72)
    }

    const spawnPetal = (petal: Petal, fromTop = true) => {
      const depth = MIN_DEPTH + Math.random() * (MAX_DEPTH - MIN_DEPTH)
      const depthRatio = 1 - (depth - MIN_DEPTH) / (MAX_DEPTH - MIN_DEPTH)

      petal.z = depth
      petal.x = Math.random() * (width + 180) - 90
      petal.y = fromTop
        ? -Math.random() * (height * 0.95 + 180) - 80
        : Math.random() * height
      petal.baseSize = 8 + depthRatio * 18 + Math.random() * 10
      petal.opacity =
        (isDark ? 0.32 : 0.42) +
        depthRatio * (isDark ? 0.22 : 0.32) +
        Math.random() * 0.1
      petal.seed = Math.random()
      petal.paletteIndex = Math.floor(Math.random() * palette.length)
      petal.rotation = Math.random() * Math.PI * 2
      petal.rotationVelocity =
        (Math.random() * 2 - 1) * (0.55 + depthRatio * 0.75)
      petal.tilt = Math.random() * Math.PI * 2
      petal.tiltVelocity = (Math.random() * 2 - 1) * (0.45 + depthRatio * 0.5)
      petal.swayPhase = Math.random() * Math.PI * 2
      petal.fallSpeed = 26 + depthRatio * 44 + Math.random() * 24
      petal.drift = (Math.random() * 2 - 1) * (5 + depthRatio * 12)
      petal.widthScale = 0.84 + Math.random() * 0.34
      petal.lengthScale = 0.9 + Math.random() * 0.22
      petal.notch = 0.22 + Math.random() * 0.32
      petal.veinAlpha = 0.12 + Math.random() * 0.14
    }

    const populatePetals = () => {
      petals.length = 0
      const count = getPetalCount()

      for (let index = 0; index < count; index += 1) {
        const petal = {} as Petal
        const startInsideViewport = reducedMotion || index < count * 0.7
        spawnPetal(petal, !startInsideViewport)
        petals.push(petal)
      }
    }

    const updatePetals = (now: number, deltaSeconds: number) => {
      const time = now / 1000
      const breeze =
        18 +
        1.5 * Math.sin(time * 0.3) * 10 +
        0.8 * Math.sin(time * 0.82) * 6 +
        0.3 * Math.sin(time * 1.55) * 4
      const windAngle = (26 * Math.PI) / 180
      const windX = Math.cos(windAngle)
      const windY = Math.sin(windAngle)

      petals.forEach((petal) => {
        const depthRatio = 1 - (petal.z - MIN_DEPTH) / (MAX_DEPTH - MIN_DEPTH)
        const sizeRatio = clamp((petal.baseSize - 10) / 24, 0, 1)
        const weight = 1 / (1 + (0.22 + sizeRatio * 0.4) * 1.2)
        const flutterStrength =
          (14 + depthRatio * 18) * weight * (1 + (0.5 - sizeRatio) * 0.8)
        const pace = 0.65 + petal.seed * 0.45
        const sway =
          1.2 * Math.sin(time * pace + petal.swayPhase + petal.seed * 11)
        const swayAlt =
          0.8 *
          Math.cos(
            time * (pace * 1.65) + petal.swayPhase * 0.7 + petal.seed * 17,
          )
        const wind = breeze * (0.55 + depthRatio * 0.65) * weight
        const lift = flutterStrength * (sway + swayAlt * 0.35)
        const fall = petal.fallSpeed * weight * (0.86 + depthRatio * 0.72)
        const tiltDrift = flutterStrength * 0.15 * swayAlt

        petal.x +=
          (wind * windX + petal.drift + lift) *
          deltaSeconds *
          (0.82 + depthRatio * 0.45)
        petal.y += (fall + wind * windY * 0.32 + tiltDrift) * deltaSeconds

        petal.rotation += petal.rotationVelocity * deltaSeconds
        petal.tilt += petal.tiltVelocity * deltaSeconds
        petal.rotationVelocity +=
          (0.45 * Math.sin(time * 2 + petal.seed * 20) -
            petal.rotationVelocity * 0.12) *
          deltaSeconds
        petal.tiltVelocity +=
          (0.7 * Math.cos(time * 1.45 + petal.seed * 15) -
            petal.tiltVelocity * 0.1) *
          deltaSeconds

        if (petal.y > height + 120) {
          spawnPetal(petal)
        }

        if (petal.x < -120) {
          petal.x = width + 120
        } else if (petal.x > width + 120) {
          petal.x = -120
        }
      })
    }

    const drawPetal = (petal: Petal) => {
      const projection = 1 / petal.z
      const size = clamp(petal.baseSize * projection, 4.5, 42)
      const blur = clamp(Math.abs(petal.z - 0.92) * 3.2, 0, 4.2)
      const alpha =
        petal.opacity *
        (1 - blur * 0.11) *
        (isDark ? 0.78 : 1) *
        (reducedMotion ? 0.88 : 1)
      const paletteItem = palette[petal.paletteIndex]

      const widthScale = size * 0.45 * petal.widthScale
      const lengthScale = size * 0.64 * petal.lengthScale
      const asymmetry = (petal.seed - 0.5) * widthScale * 0.16
      const lobeLift = Math.sin(petal.seed * 11.3) * lengthScale * 0.035
      const tiltScale = Math.max(0.34, Math.abs(Math.cos(petal.tilt)))

      ctx.save()
      ctx.translate(petal.x, petal.y)
      ctx.rotate(petal.rotation)
      ctx.scale(tiltScale, 1)
      ctx.globalAlpha = alpha
      ctx.shadowBlur = blur * 4 + 2
      ctx.shadowColor = paletteItem.glow

      const fillGradient = ctx.createLinearGradient(
        0,
        lengthScale * 0.52,
        0,
        -lengthScale * 0.64,
      )
      fillGradient.addColorStop(0, paletteItem.base)
      fillGradient.addColorStop(0.56, paletteItem.mid)
      fillGradient.addColorStop(1, paletteItem.tip)

      ctx.beginPath()
      ctx.moveTo(0, lengthScale * 0.5)
      ctx.bezierCurveTo(
        widthScale * 0.26 + asymmetry * 0.2,
        lengthScale * 0.16,
        widthScale * 0.9,
        -lengthScale * 0.06,
        widthScale * 0.38 + asymmetry,
        -lengthScale * 0.44 + lobeLift,
      )
      ctx.quadraticCurveTo(
        widthScale * 0.1 + asymmetry * 0.3,
        -lengthScale * 0.66,
        0,
        -lengthScale * (0.54 - petal.notch * 0.12),
      )
      ctx.quadraticCurveTo(
        -widthScale * 0.1 + asymmetry * 0.3,
        -lengthScale * 0.66,
        -widthScale * 0.38 + asymmetry,
        -lengthScale * 0.44 - lobeLift * 0.7,
      )
      ctx.bezierCurveTo(
        -widthScale * 0.9,
        -lengthScale * 0.06,
        -widthScale * 0.26 + asymmetry * 0.2,
        lengthScale * 0.16,
        0,
        lengthScale * 0.5,
      )
      ctx.closePath()

      ctx.fillStyle = fillGradient
      ctx.fill()

      ctx.shadowBlur = 0
      ctx.strokeStyle = paletteItem.edge
      ctx.lineWidth = Math.max(0.7, size * 0.03)
      ctx.globalAlpha = alpha * 0.48
      ctx.stroke()

      if (blur < 3) {
        ctx.globalAlpha = alpha * petal.veinAlpha * (1 - blur * 0.14)
        ctx.lineWidth = Math.max(0.6, size * 0.022)
        ctx.strokeStyle = paletteItem.vein

        ctx.beginPath()
        ctx.moveTo(0, lengthScale * 0.4)
        ctx.quadraticCurveTo(
          asymmetry * 0.15,
          -lengthScale * 0.02,
          0,
          -lengthScale * 0.42,
        )
        ctx.stroke()
      }

      ctx.restore()
    }

    const render = (now: number, step: boolean) => {
      if (step) {
        const deltaSeconds = clamp((now - lastFrame) / 1000, 0.001, 0.035)
        lastFrame = now
        updatePetals(now, deltaSeconds)
      } else {
        lastFrame = now
      }

      ctx.clearRect(0, 0, width, height)

      petals.sort((left, right) => right.z - left.z)
      petals.forEach(drawPetal)
    }

    const stopLoop = () => {
      if (!animationFrame) return
      cancelAnimationFrame(animationFrame)
      animationFrame = 0
    }

    const loop = (now: number) => {
      animationFrame = 0
      render(now, true)
      startLoop()
    }

    const startLoop = () => {
      if (reducedMotion || document.hidden || animationFrame) return
      animationFrame = requestAnimationFrame(loop)
    }

    const refreshScene = () => {
      stopLoop()
      resizeCanvas()
      populatePetals()
      render(performance.now(), false)
      startLoop()
    }

    const handleReducedMotionChange = () => {
      reducedMotion = prefersReducedMotion.matches
      refreshScene()
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopLoop()
        return
      }

      lastFrame = performance.now()
      startLoop()
    }

    refreshScene()

    window.addEventListener('resize', refreshScene)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    if ('addEventListener' in prefersReducedMotion) {
      prefersReducedMotion.addEventListener('change', handleReducedMotionChange)
    } else {
      reducedMotionLegacyApi.addListener?.(handleReducedMotionChange)
    }

    return () => {
      stopLoop()
      window.removeEventListener('resize', refreshScene)
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      if ('removeEventListener' in prefersReducedMotion) {
        prefersReducedMotion.removeEventListener(
          'change',
          handleReducedMotionChange,
        )
      } else {
        reducedMotionLegacyApi.removeListener?.(handleReducedMotionChange)
      }
    }
  }, [isDark])

  return (
    <canvas
      aria-hidden
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 size-full"
    />
  )
}
