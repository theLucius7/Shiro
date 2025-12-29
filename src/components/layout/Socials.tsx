import type { ComponentType } from 'react'

import { BilibiliIcon } from '~/components/icons/platform/BilibiliIcon'
import { GitHubBrandIcon } from '~/components/icons/platform/GitHubBrandIcon'
import { MailIcon } from '~/components/icons/platform/MailIcon'
import { NeteaseCloudMusicIcon } from '~/components/icons/platform/NeteaseIcon'
import { SteamIcon } from '~/components/icons/platform/SteamIcon'
import { IcBaselineTelegram } from '~/components/icons/platform/Telegram'
import { XIcon } from '~/components/icons/platform/XIcon'
import { MotionButtonBase } from '~/components/ui/button'
import { FloatPopover } from '~/components/ui/float-popover'
import { BottomToUpTransitionView } from '~/components/ui/transition'
import { clsxm } from '~/lib/helper'

type SocialLink = {
  id: string
  url: string
  icon: string
}

const socialLinks: SocialLink[] = [
  {
    id: 'github',
    url: 'https://github.com/theLucius7',
    icon: 'Github',
  },
  {
    id: 'twitter',
    url: 'https://x.com/theLucius7',
    icon: 'X',
  },
  {
    id: 'telegram',
    url: 'https://t.me/theLucius7',
    icon: 'Telegram',
  },
  {
    id: 'mail',
    url: 'mailto:lucius7nya@gmail.com',
    icon: 'Mail',
  },
  {
    id: 'bilibili',
    url: 'https://space.bilibili.com/1814052279',
    icon: 'Bilibili',
  },
  {
    id: 'netease',
    url: 'https://music.163.com/#/user/home?id=1928692426',
    icon: 'Netease',
  },
  {
    id: 'steam',
    url: 'https://steamcommunity.com/id/theLucius7/',
    icon: 'Steam',
  },
]

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  github: GitHubBrandIcon,
  twitter: XIcon,
  telegram: IcBaselineTelegram,
  mail: MailIcon,
  bilibili: BilibiliIcon,
  netease: NeteaseCloudMusicIcon,
  steam: SteamIcon,
}

type SocialsProps = {
  className?: string
  transitionDelayStart?: number
}

export const Socials = ({
  className,
  transitionDelayStart = 0,
}: SocialsProps) => {
  return (
    <ul className={clsxm('flex flex-wrap gap-4', className)}>
      {socialLinks.map((item, index) => {
        const Icon = iconMap[item.id]
        if (!Icon) return null

        return (
          <BottomToUpTransitionView
            key={item.id}
            delay={index * 100 + transitionDelayStart}
            className="inline-block"
            as="li"
          >
            <FloatPopover
              type="tooltip"
              triggerElement={
                <MotionButtonBase className="center flex aspect-square size-10 rounded-full bg-neutral-900/80 text-2xl text-white dark:bg-neutral-100/20">
                  <a
                    target="_blank"
                    href={item.url}
                    className="center flex"
                    rel="noreferrer"
                    aria-label={item.icon}
                  >
                    <Icon />
                  </a>
                </MotionButtonBase>
              }
            >
              {item.icon}
            </FloatPopover>
          </BottomToUpTransitionView>
        )
      })}
    </ul>
  )
}
