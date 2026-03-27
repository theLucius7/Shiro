'use client'

import { startTransition, useCallback, useEffect, useState } from 'react'

import { FABPortable } from '~/components/ui/fab'
import { useModalStack } from '~/components/ui/modal'
import { MAIN_MARKDOWN_ID } from '~/constants/dom-id'
import { DOMCustomEvents } from '~/constants/event'
import { useForceUpdate } from '~/hooks/common/use-force-update'

import { useTocHeadingStrategy } from './TocHeadingStrategy'
import { TocTree } from './TocTree'

export const TocFAB = () => {
  const { present } = useModalStack()
  const [forceUpdate, updated] = useForceUpdate()
  const [$headings, setHeadings] = useState<HTMLHeadingElement[]>()

  useEffect(() => {
    const handler = () => {
      startTransition(() => {
        forceUpdate()
      })
    }

    document.addEventListener(DOMCustomEvents.RefreshToc, handler)
    return () => {
      document.removeEventListener(DOMCustomEvents.RefreshToc, handler)
    }
  }, [forceUpdate])

  const queryHeadings = useTocHeadingStrategy()
  useEffect(() => {
    const $mainMarkdownRender = document.getElementById(MAIN_MARKDOWN_ID)
    if (!$mainMarkdownRender) {
      setHeadings(undefined)
      return
    }

    setHeadings(queryHeadings($mainMarkdownRender))
  }, [queryHeadings, updated])

  const presentToc = useCallback(() => {
    present({
      title: '文章目录',
      clickOutsideToDismiss: true,
      content: ({ dismiss }) => (
        <TocTree
          $headings={$headings!}
          className="max-h-full space-y-3 overflow-y-auto [&>li]:py-1"
          onItemClick={() => {
            dismiss()
          }}
          scrollInNextTick
        />
      ),
    })
  }, [$headings, present])

  if (!$headings?.length) return null

  return (
    <FABPortable aria-label="Show ToC" onClick={presentToc}>
      <i className="i-mingcute-list-expansion-line" />
    </FABPortable>
  )
}
