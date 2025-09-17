import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '../useAuth'
import { ToastProvider } from '../../components/ui/Toast'

const mockNavigate = vi.fn()

// Mock dependencies
vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({ navigate: mockNavigate }),
}))

vi.mock('../api', () => ({
  apiClient: {
    register: vi.fn(),
    login: vi.fn(),
    requestGuestAccess: vi.fn(),
    verifyGuestAccess: vi.fn(),
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
      </ToastProvider>
    </QueryClientProvider>
  )
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with no authenticated user', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(result.current.guestEmail).toBeNull()
  })

  it('should provide auth actions', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.register).toBe('function')
    expect(typeof result.current.requestAccess).toBe('function')
    expect(typeof result.current.verifyAccess).toBe('function')
    expect(typeof result.current.logout).toBe('function')
  })

  it('should handle logout correctly', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    result.current.logout()

    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' })
  })
})