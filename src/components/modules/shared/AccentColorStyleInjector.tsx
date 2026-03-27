import chroma from 'chroma-js'
import Color from 'colorjs.io'

import { createPngNoiseBackground } from '~/lib/noise'

const hexToOklchString = (hex: string) => {
  // @ts-ignore
  return new Color(hex).oklch
}
const accentColorLight = [
  // 浅葱
  '#33A6B8',

  '#FF6666',
  '#26A69A',
  '#fb7287',
  '#69a6cc',
]
const accentColorDark = [
  // 桃
  '#F596AA',

  '#A0A7D4',
  '#ff7b7b',
  '#99D8CF',
  '#838BC6',
]
const defaultAccentColor = { light: accentColorLight, dark: accentColorDark }

const lightBg = '#fefdfb'
const darkBg = '#1c1c1e'

const toCssColor = (value: chroma.Color, alpha?: number) => {
  return alpha === undefined ? value.css() : value.alpha(alpha).css()
}

export async function AccentColorStyleInjector({
  color,
}: {
  color?: AccentColor
}) {
  const { light, dark } = color || defaultAccentColor

  const lightColors = light ?? accentColorLight
  const darkColors = dark ?? accentColorDark

  const Length = Math.max(lightColors.length ?? 0, darkColors.length ?? 0)
  const randomSeedRef = (Math.random() * Length) | 0
  const currentAccentColorLRef = lightColors[randomSeedRef]
  const currentAccentColorDRef = darkColors[randomSeedRef]

  const lightOklch = hexToOklchString(currentAccentColorLRef)
  const darkOklch = hexToOklchString(currentAccentColorDRef)

  const [hl, sl, ll] = lightOklch
  const [hd, sd, ld] = darkOklch

  const [lightBgImage, darkBgImage] = await Promise.all([
    createPngNoiseBackground(currentAccentColorLRef),
    createPngNoiseBackground(currentAccentColorDRef),
  ])

  const lightBase = chroma.mix(lightBg, currentAccentColorLRef, 0.025, 'rgb')
  const darkBase = chroma.mix(darkBg, currentAccentColorDRef, 0.06, 'rgb')

  const lightAmbientHighlight = toCssColor(
    chroma.mix('#fff8ef', currentAccentColorLRef, 0.08, 'rgb'),
    0.82,
  )
  const lightWashiGlow = toCssColor(
    chroma.mix('#fff0df', currentAccentColorLRef, 0.18, 'rgb'),
    0.55,
  )
  const lightCloudCool = toCssColor(
    chroma.mix('#ffffff', currentAccentColorLRef, 0.08, 'rgb'),
    0.22,
  )
  const lightCloudWarm = toCssColor(
    chroma.mix('#edd8be', currentAccentColorLRef, 0.14, 'rgb'),
    0.24,
  )
  const lightBendStrong = toCssColor(
    chroma.mix('#fff8f0', currentAccentColorLRef, 0.05, 'rgb'),
    0.3,
  )
  const lightBendSoft = toCssColor(
    chroma.mix('#f7ead6', currentAccentColorLRef, 0.1, 'rgb'),
    0.18,
  )

  const darkAmbientHighlight = toCssColor(
    chroma.mix('#d8deef', currentAccentColorDRef, 0.15, 'rgb'),
    0.14,
  )
  const darkWashiGlow = toCssColor(
    chroma.mix('#90a0cf', currentAccentColorDRef, 0.18, 'rgb'),
    0.1,
  )
  const darkCloudCool = toCssColor(
    chroma.mix('#eef2ff', currentAccentColorDRef, 0.08, 'rgb'),
    0.08,
  )
  const darkCloudWarm = toCssColor(
    chroma.mix('#6f6557', currentAccentColorDRef, 0.18, 'rgb'),
    0.08,
  )
  const darkBendStrong = toCssColor(
    chroma.mix('#ffffff', currentAccentColorDRef, 0.04, 'rgb'),
    0.06,
  )
  const darkBendSoft = toCssColor(
    chroma.mix('#e4dcce', currentAccentColorDRef, 0.08, 'rgb'),
    0.04,
  )

  const lightHeroPrimary = toCssColor(
    chroma.mix('#ffe4b4', currentAccentColorLRef, 0.12, 'rgb'),
    0.36,
  )
  const lightHeroSecondary = toCssColor(
    chroma.mix('#fff0df', currentAccentColorLRef, 0.4, 'rgb'),
    0.24,
  )
  const lightHeroAmbient = toCssColor(
    chroma.mix('#ffffff', currentAccentColorLRef, 0.08, 'rgb'),
    0.68,
  )

  const darkHeroPrimary = toCssColor(
    chroma.mix('#b4c8ff', currentAccentColorDRef, 0.12, 'rgb'),
    0.15,
  )
  const darkHeroSecondary = toCssColor(
    chroma.mix('#6d8cff', currentAccentColorDRef, 0.35, 'rgb'),
    0.16,
  )
  const darkHeroAmbient = toCssColor(
    chroma.mix('#ffffff', currentAccentColorDRef, 0.02, 'rgb'),
    0.08,
  )

  return (
    <style
      id="accent-color-style"
      data-light={currentAccentColorLRef}
      data-dark={currentAccentColorDRef}
      dangerouslySetInnerHTML={{
        __html: `
        html[data-theme='light'] {
          --a: ${`${hl} ${sl} ${ll}`};
          --root-bg: ${lightBase.hex()};
          --color-root-bg: var(--root-bg);
          --paper-grain-image: ${lightBgImage};
          --paper-ambient-highlight: ${lightAmbientHighlight};
          --paper-washi-glow: ${lightWashiGlow};
          --paper-cloud-cool: ${lightCloudCool};
          --paper-cloud-warm: ${lightCloudWarm};
          --paper-bend-strong: ${lightBendStrong};
          --paper-bend-soft: ${lightBendSoft};
          --hero-glow-primary: ${lightHeroPrimary};
          --hero-glow-secondary: ${lightHeroSecondary};
          --hero-glow-ambient: ${lightHeroAmbient};
        }
        html[data-theme='dark'] {
          --a: ${`${hd} ${sd} ${ld}`};
          --root-bg: ${darkBase.hex()};
          --color-root-bg: var(--root-bg);
          --paper-grain-image: ${darkBgImage};
          --paper-ambient-highlight: ${darkAmbientHighlight};
          --paper-washi-glow: ${darkWashiGlow};
          --paper-cloud-cool: ${darkCloudCool};
          --paper-cloud-warm: ${darkCloudWarm};
          --paper-bend-strong: ${darkBendStrong};
          --paper-bend-soft: ${darkBendSoft};
          --hero-glow-primary: ${darkHeroPrimary};
          --hero-glow-secondary: ${darkHeroSecondary};
          --hero-glow-ambient: ${darkHeroAmbient};
        }
        `,
      }}
    />
  )
}

// const isSafari = () =>
//   /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

// const STEP = 60
// const INTERVAL = 500

// export const AccentColorProvider = ({ children }: PropsWithChildren) => {
//   const { light, dark } =
//     useAppConfigSelector((config) => config.color) || (noopObj as AccentColor)

//   const lightColors = light ?? accentColorLight
//   const darkColors = dark ?? accentColorDark

//   const Length = Math.max(lightColors.length ?? 0, darkColors.length ?? 0)
//   const randomSeedRef = useRef((Math.random() * Length) | 0)
//   const currentAccentColorLRef = useRef(lightColors[randomSeedRef.current])
//   const currentAccentColorDRef = useRef(darkColors[randomSeedRef.current])

//   const [u, update] = useState(0)
//   const updateColorEvent = useEventCallback(() => {
//     const $style = document.createElement('style')

//     const nextSeed = (randomSeedRef.current + 1) % Length
//     const nextColorD = darkColors[nextSeed]
//     const nextColorL = lightColors[nextSeed]
//     const colorsD = generateTransitionColors(
//       currentAccentColorDRef.current,
//       nextColorD,
//       STEP,
//     )
//     const colorsL = generateTransitionColors(
//       currentAccentColorLRef.current,
//       nextColorL,
//       STEP,
//     )

//     let timerDispose = setIdleTimeout(function updateAccent() {
//       const colorD = colorsD.shift()
//       const colorL = colorsL.shift()
//       if (colorD && colorL) {
//         currentAccentColorDRef.current = colorD
//         currentAccentColorLRef.current = colorL

//         try {
//           timerDispose()
//         } catch {}
//         timerDispose = setIdleTimeout(updateAccent, INTERVAL)
//       } else {
//         randomSeedRef.current = nextSeed
//         currentAccentColorDRef.current = nextColorD
//         currentAccentColorLRef.current = nextColorL
//         update(u + 1)
//       }

//       const lightHsl = hexToHsl(currentAccentColorLRef.current)
//       const darkHsl = hexToHsl(currentAccentColorDRef.current)

//       const [hl, sl, ll] = lightHsl
//       const [hd, sd, ld] = darkHsl

//       $style.innerHTML = `:root[data-theme='light'] {
//           --a: ${`${hl} ${sl}% ${ll}%`};
//           --af: ${`${hl} ${sl}% ${ll + 6}%`};
//         }
//         :root[data-theme='dark'] {
//           --a: ${`${hd} ${sd}% ${ld}%`};
//           --af: ${`${hd} ${sd}% ${ld - 6}%`};
//         }
//         `
//     }, INTERVAL)

//     document.head.appendChild($style)
//     return () => {
//       timerDispose()

//       setTimeout(() => {
//         document.head.removeChild($style)
//       }, INTERVAL)
//     }
//   })
//   useEffect(() => {

//     // safari 性能不行
//     if (isSafari()) return
//     return updateColorEvent()
//   }, [Length, darkColors, lightColors, u, updateColorEvent])

//   useServerInsertedHTML(() => {
//     const lightHsl = hexToHsl(currentAccentColorLRef.current)
//     const darkHsl = hexToHsl(currentAccentColorDRef.current)

//     const [hl, sl, ll] = lightHsl
//     const [hd, sd, ld] = darkHsl

//     return (
//       <style
//         id="accent-color-style"
//         data-light={currentAccentColorLRef.current}
//         data-dark={currentAccentColorDRef.current}
//         dangerouslySetInnerHTML={{
//           __html: `html[data-theme='light'] {
//           --a: ${`${hl} ${sl}% ${ll}%`};
//           --af: ${`${hl} ${sl}% ${ll + 6}%`};
//         }
//         html[data-theme='dark'] {
//           --a: ${`${hd} ${sd}% ${ld}%`};
//           --af: ${`${hd} ${sd}% ${ld - 6}%`};
//         }
//         `,
//         }}
//       />
//     )
//   })

//   return children
// }

// function setIdleTimeout(onIdle: () => void, timeout: number): () => void {
//   let timeoutId: number | undefined

//   const debounceReset = debounce(() => {
//     clearTimeout(timeoutId)
//     timeoutId = window.setTimeout(() => {
//       onIdle()
//     }, timeout)
//   }, 100)

//   // 重置计时器的函数
//   const resetTimer = () => {
//     window.clearTimeout(timeoutId)
//     debounceReset()
//   }

//   // 监听浏览器的活动事件
//   window.addEventListener('mousemove', resetTimer)
//   window.addEventListener('keypress', resetTimer)
//   window.addEventListener('touchstart', resetTimer)
//   window.addEventListener('scroll', resetTimer)

//   // 启动计时器
//   resetTimer()

//   // 提供取消功能
//   return function cancel(): void {
//     window.clearTimeout(timeoutId)
//     window.removeEventListener('mousemove', resetTimer)
//     window.removeEventListener('keypress', resetTimer)
//     window.removeEventListener('touchstart', resetTimer)
//     window.removeEventListener('scroll', resetTimer)
//   }
// }
