'use client'

import type { FC, PropsWithChildren } from 'react'
import { ErrorBoundary as ErrorBoundaryLib } from 'react-error-boundary'

// import { captureException } from '@sentry/nextjs'
import { StyledButton } from '../ui/button'

const FallbackComponent = () => {
  return (
    <div className="center flex w-full flex-col py-6">
      页面组件加载失败，请刷新后重试。
      <StyledButton
        onClick={() => {
          window.location.reload()
        }}
      >
        Reload Page
      </StyledButton>
    </div>
  )
}
export const ErrorBoundary: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ErrorBoundaryLib
      FallbackComponent={FallbackComponent}
      onError={(e) => {
        console.error(e)

        // TODO  sentry

        // captureException(e)
      }}
    >
      {children}
    </ErrorBoundaryLib>
  )
}
