import { createRootRoute, Outlet } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { queryClient } from '../lib/api'
import { AppErrorBoundary } from '../components/ErrorBoundary'
import { ToastProvider } from '../components/ui/Toast'
import { analytics } from '../lib/analytics'
import { useEffect } from 'react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  useEffect(() => {
    // Track page views
    analytics.trackPageView(window.location.pathname)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AppErrorBoundary>
          <div className="min-h-screen bg-gray-50">
            <Outlet />
          </div>
          {import.meta.env.DEV && (
            <>
              <TanStackRouterDevtools />
              <ReactQueryDevtools initialIsOpen={false} />
            </>
          )}
        </AppErrorBoundary>
      </ToastProvider>
    </QueryClientProvider>
  )
}