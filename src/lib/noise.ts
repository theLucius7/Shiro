'use server'

import { PNG } from 'pngjs'

const hexToRbg = (hex: string) => {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

const clampChannel = (value: number) => {
  return Math.max(0, Math.min(255, Math.round(value)))
}

export const createPngNoiseBackground = async (hex: string) => {
  const { b, g, r } = hexToRbg(hex)
  const width = 96
  const height = 96
  const png = new PNG({
    width,
    height,
    filterType: -1, // 禁用过滤器
  })

  // 用低对比的纤维噪点模拟纸面纹理，而不是生硬的黑白颗粒。
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2
      const diagonalWave = (Math.sin((x + y * 0.65) / 12) + 1) * 0.5
      const verticalWave = (Math.cos((x * 0.4 - y) / 19) + 1) * 0.5
      const spark = Math.random()
      const fiberAlpha =
        diagonalWave * 9 +
        verticalWave * 7 +
        (spark > 0.985 ? 22 : spark > 0.93 ? 8 : 0)
      const tint = (Math.random() - 0.5) * 8 + diagonalWave * 2 - verticalWave

      png.data[idx] = clampChannel(r + tint)
      png.data[idx + 1] = clampChannel(g + tint)
      png.data[idx + 2] = clampChannel(b + tint)
      png.data[idx + 3] = clampChannel(fiberAlpha)
    }
  }

  return new Promise<string>((resolve) => {
    const chunks = [] as Buffer[]
    png
      .pack()
      .on('data', (chunk) => {
        chunks.push(chunk)
      })
      .on('end', () => {
        const buffer = Buffer.concat(chunks)
        resolve(`url('data:image/png;base64,${buffer.toString('base64')}')`)
      })
  })
}
