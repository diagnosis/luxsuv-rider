import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { toast } from 'sonner'

type VerifyEmailSearch = {
  token?: string
}

export const Route = createFileRoute('/auth/verify-email')({
  component: VerifyEmailPage,
  validateSearch: (search: Record<string, unknown>): VerifyEmailSearch => {
    return {
      token: search.token as string,
    }
  },
})

function VerifyEmailPage() {
  const navigate = useNavigate()
  const { token } = useSearch({ from: '/auth/verify-email' })
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided')
      return
    }

    let isCancelled = false

    const verifyEmail = async () => {
      try {
        const response = await api.verifyEmail(token)
        
        if (isCancelled) return
        
        setStatus('success')
        setMessage(response?.message || 'Email verified successfully!')
        toast.success('Email verified successfully!')
        
        setTimeout(() => {
          if (!isCancelled) {
            navigate({ to: '/auth/login', replace: true })
          }
        }, 2000)
        
      } catch (error: any) {
        if (isCancelled) return
        
        setStatus('error')
        const errorMessage = error.details || error.message || 'Verification failed'
        setMessage(errorMessage)
        toast.error(errorMessage)
      }
    }

    verifyEmail()

    return () => {
      isCancelled = true
    }
  }, [token, navigate])

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
              <button
                onClick={() => navigate({ to: '/', replace: true })}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Back to home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}