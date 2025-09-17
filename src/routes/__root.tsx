import { createRootRoute, Outlet } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from 'sonner'
import { queryClient } from '../lib/api'
import { AppErrorBoundary } from '../components/ErrorBoundary'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <Outlet />
          <Toaster position="top-right" richColors />
        </div>
        {import.meta.env.DEV && (
          <>
            <TanStackRouterDevtools />
            <ReactQueryDevtools initialIsOpen={false} />
          </>
        )}
      </AppErrorBoundary>
    </QueryClientProvider>
  )
}