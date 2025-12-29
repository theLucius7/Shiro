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

// 1. 定义数据结构
type SocialLink = {
  id: string
  url: string
  icon: string
  color: string
}

// 2. 静态配置数据 (含品牌色)
const socialLinks: SocialLink[] = [
  {
    id: 'github',
    url: 'https://github.com/theLucius7',
    icon: 'Github',
    color: '#181717',
  },
  {
    id: 'twitter',
    url: 'https://x.com/theLucius7',
    icon: 'X',
    color: 'rgba(36,46,54,1.00)',
  },
  {
    id: 'telegram',
    url: 'https://t.me/theLucius7',
    icon: 'Telegram',
    color: '#0088cc',
  },
  {
    id: 'mail',
    url: 'mailto:lucius7nya@gmail.com',
    icon: 'Mail',
    color: '#D44638',
  },
  {
    id: 'bilibili',
    url: 'https://space.bilibili.com/1814052279',
    icon: 'Bilibili',
    color: '#00A1D6',
  },
  {
    id: 'netease',
    url: 'https://music.163.com/#/user/home?id=1928692426',
    icon: 'Netease',
    color: '#C20C0C',
  },
  {
    id: 'steam',
    url: 'https://steamcommunity.com/id/theLucius7/',
    icon: 'Steam',
    color: '#0F1C30',
  },
]

// 3. 图标映射表
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

// 4. 组件主体
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
                <MotionButtonBase
                  // 核心修复：移除 bg-neutral-900/80 等类名，保留布局类名
                  className="center flex aspect-square size-10 rounded-full text-2xl text-white"
                  // 核心修复：直接通过 style 注入品牌色
                  style={{ background: item.color }}
                >
                  <a
                    target="_blank"
                    href={item.url}
                    className="center flex"
                    rel="noreferrer noopener" // 安全实践
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
