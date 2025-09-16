import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { useToast } from '../components/ui/Toast'

export function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided')
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await apiClient.post(`/v1/auth/verify-email?token=${encodeURIComponent(token)}`)
        setStatus('success')
        setMessage(response.data?.message || 'Email verified successfully!')
        showToast('Email verified successfully!', 'success')
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } catch (error: any) {
        setStatus('error')
        const errorMessage = error.response?.data?.message || error.message || 'Verification failed'
        setMessage(errorMessage)
        showToast(errorMessage, 'error')
      }
    }

    verifyEmail()
  }, [token, navigate, showToast])

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
                onClick={() => navigate('/login')}
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
                onClick={() => navigate('/')}
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