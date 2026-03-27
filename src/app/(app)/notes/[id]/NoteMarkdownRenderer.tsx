'use client'

import type { Key } from 'react'

import { MainMarkdown, RuleType } from '~/components/ui/markdown'
import type { MarkdownToJSX } from '~/components/ui/markdown'
import { useCurrentNoteDataSelector } from '~/providers/note/CurrentNoteDataProvider'

const MarkdownRenderers: Partial<MarkdownToJSX.PartialRules> = {
  [RuleType.text]: {
    render(node: MarkdownToJSX.TextNode, _: any, state?: MarkdownToJSX.State) {
      return <span key={state?.key as Key}>{node.text}</span>
    },
  },
}

export const NoteMarkdownRenderer = () => {
  const text = useCurrentNoteDataSelector((data) => data?.data.text)
  if (!text) return null

  return (
    <MainMarkdown
      className="mt-10"
      allowsScript
      renderers={MarkdownRenderers}
      value={text}
    />
  )
}
