import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { apiClient } from '../lib/api'
import { useAuthStore } from '../store/auth'

type VerifyEmailSearch = {
  token?: string
}

export const Route = createFileRoute('/verify-email')({
  component: VerifyEmailPage,
  validateSearch: (search: Record<string, unknown>): VerifyEmailSearch => {
    return {
      token: typeof search.token === 'string' ? search.token : undefined,
    }
  },
})

function VerifyEmailPage() {
  const navigate = useNavigate()
  const { token } = useSearch({ from: '/verify-email' })
  const { clearAll } = useAuthStore()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')
  const verificationAttempted = useRef(false)

  useEffect(() => {
    // Clear any existing auth state to prevent automatic API calls
    clearAll()
    
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link. Please check your email for the correct link.')
      return
    }

    // Prevent duplicate verification attempts
    if (verificationAttempted.current) {
      return
    }
    verificationAttempted.current = true

    const verifyEmail = async () => {
      try {
        const response = await apiClient.verifyEmail(token)
        
        setStatus('success')
        setMessage(response?.message || 'Email verified successfully!')
        
        // Navigate after a short delay
        setTimeout(() => {
          navigate({ to: '/auth/login', replace: true })
        }, 1500)
        
      } catch (error: any) {
        setStatus('error')
        const errorMessage = error.status === 404 
          ? 'Invalid or expired verification link'
          : error.details || error.message || 'Verification failed'
        setMessage(errorMessage)
      }
    }

    verifyEmail()
  }, [token, navigate, clearAll])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          {status === 'verifying' && (
            <>
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying Email</h2>
              <p className="text-gray-600">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-green-600 text-5xl mb-4">✓</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
              <button
                onClick={() => navigate({ to: '/auth/login', replace: true })}
                className="mt-4 text-blue-600 hover:text-blue-800 underline"
              >
                Go to login now
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-red-600 text-5xl mb-4">✗</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="space-y-2">
                <button
                  onClick={() => navigate({ to: '/', replace: true })}
                  className="text-blue-600 hover:text-blue-800 underline block"
                >
                  Back to home
                </button>
                <button
                  onClick={() => navigate({ to: '/auth/login', replace: true })}
                  className="text-blue-600 hover:text-blue-800 underline block"
                >
                  Go to login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}