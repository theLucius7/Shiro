'use client'

import { useQuery } from '@tanstack/react-query'
import { m } from 'motion/react'
import { memo } from 'react'

import { ImpressionView } from '~/components/common/ImpressionTracker'
import { FloatPopover } from '~/components/ui/float-popover'
import { softBouncePreset } from '~/constants/spring'
import { TrackerAction } from '~/constants/tracker'
import { usePageIsActive } from '~/hooks/common/use-is-active'

import { useHeaderMetaShouldShow } from './hooks'

const SPOTIFY_STATUS_URL =
  'https://mx-space-core.lucius7.dev/api/v2/serverless/status/spotify'

type SpotifyStatus = {
  albumArt?: string
  isPlaying: boolean
  title?: string
  url?: string
}

const ErrorFallback = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="12" fill="#121212"/>
    <path fill="#1DB954" d="M32 15c-9.39 0-17 7.61-17 17s7.61 17 17 17s17-7.61 17-17s-7.61-17-17-17Zm7.8 24.52a1.56 1.56 0 0 1-2.15.52c-5.9-3.6-13.33-4.42-22.08-2.43a1.56 1.56 0 1 1-.69-3.04c9.57-2.18 17.8-1.24 24.41 2.8c.73.45.96 1.42.51 2.15Zm3.07-5.52a1.95 1.95 0 0 1-2.68.64c-6.75-4.15-17.05-5.36-25.03-2.94a1.95 1.95 0 1 1-1.13-3.73c9.09-2.76 20.43-1.38 28.2 3.39c.92.56 1.2 1.76.64 2.68Zm.26-5.75c-8.1-4.8-21.47-5.24-29.2-3.04a2.34 2.34 0 0 1-1.28-4.5c8.88-2.53 23.63-2.04 32.86 3.42a2.34 2.34 0 1 1-2.38 4.12Z"/>
  </svg>`,
)}`

const fetchSpotifyStatus = async (): Promise<SpotifyStatus> => {
  const response = await fetch(SPOTIFY_STATUS_URL, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch spotify status: ${response.status}`)
  }

  return (await response.json()) as SpotifyStatus
}

export const Activity = () => {
  const shouldShowMeta = useHeaderMetaShouldShow()
  const isPageActive = usePageIsActive()

  const { data } = useQuery({
    queryKey: ['spotify-status'],
    queryFn: fetchSpotifyStatus,
    refetchInterval: 1000 * 30,
    refetchOnMount: 'always',
    retry: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: 'always',
    enabled: isPageActive,
    meta: {
      persist: false,
    },
  })

  if (shouldShowMeta) return null
  if (!isPageActive) return null
  if (!data?.isPlaying || !data.albumArt || !data.title) return null

  return (
    <m.div
      key={data.title}
      className="pointer-events-auto absolute inset-y-0 right-3 z-10 flex items-center overflow-hidden lg:right-[-25px]"
      initial={{
        opacity: 0.0001,
        y: 15,
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      exit={{
        opacity: 0,
        x: -10,
      }}
      transition={softBouncePreset}
    >
      <FloatPopover
        TriggerComponent={SpotifyArtwork}
        triggerComponentProps={{
          albumArt: data.albumArt,
          title: data.title,
          url: data.url,
        }}
        type="tooltip"
        strategy="fixed"
      >
        <ImpressionView
          action={TrackerAction.Impression}
          trackerMessage="SpotifyStatus"
        >
          <span className="whitespace-pre-line">我在听 {data.title}</span>
        </ImpressionView>
      </FloatPopover>
    </m.div>
  )
}

const SpotifyArtwork = memo<{
  albumArt: string
  title: string
  url?: string
}>(({ albumArt, title, url }) => {
  const artwork = (
    <img
      width={32}
      height={32}
      src={albumArt}
      alt={title}
      fetchPriority="low"
      className="pointer-events-none size-8 select-none rounded-md shadow-sm ring-1 ring-black/10 dark:ring-white/10"
      onError={(event) => {
        event.currentTarget.src = ErrorFallback
      }}
    />
  )

  if (!url) return artwork

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label={`在 Spotify 打开 ${title}`}
      className="block"
    >
      {artwork}
    </a>
  )
})

SpotifyArtwork.displayName = 'SpotifyArtwork'
