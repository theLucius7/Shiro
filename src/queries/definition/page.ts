import type { PageModel } from '@mx-space/api-client'

import { apiClient } from '~/lib/request'

import { defineQuery } from '../helper'

export const page = {
  bySlug: (slug: string) =>
    defineQuery({
      queryKey: ['page', slug],

      queryFn: async ({ queryKey }) => {
        const [, slug] = queryKey

        const data = await apiClient.page.proxy.slug(slug).get<PageModel>({
          params: {
            prefer: 'lexical',
          },
        })

        return data
      },
    }),
}
