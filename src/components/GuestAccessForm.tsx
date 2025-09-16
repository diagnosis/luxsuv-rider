import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { guestRequestSchema, guestVerifySchema, type GuestRequestData, type GuestVerifyData } from '../lib/schemas'
import { useAuthStore } from '../store/auth'
import { useToast } from './ui/Toast'
import type { GuestAccessResponse } from '../lib/api-types'

export function GuestAccessForm() {
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const { setGuestAuth } = useAuthStore()
  const { showToast } = useToast()

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Access Your Bookings
        </h2>
        
        {step === 'request' ? (
          <RequestCodeForm
            onSuccess={(email) => {
              setEmail(email)
              setStep('verify')
            }}
          />
        ) : (
          <VerifyCodeForm
            email={email}
            onSuccess={(token) => {
              setGuestAuth(token, email)
              showToast('Access granted!', 'success')
              navigate('/guest/bookings')
            }}
            onBack={() => setStep('request')}
          />
        )}
      </div>
    </div>
  )
}

interface RequestCodeFormProps {
  onSuccess: (email: string) => void
}

function RequestCodeForm({ onSuccess }: RequestCodeFormProps) {
  const { showToast } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<GuestRequestData>({
    resolver: zodResolver(guestRequestSchema)
  })

  const onSubmit = async (data: GuestRequestData) => {
    try {
      await apiClient.post('/v1/guest/access/request', data)
      showToast('Verification code sent to your email!', 'success')
      onSuccess(data.email)
    } catch (error: any) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message
      
      if (status === 400) {
        showToast('Please enter a valid email address', 'error')
      } else if (status === 422) {
        showToast(message, 'error')
      } else {
        showToast('Failed to send code. Please try again.', 'error')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          placeholder="Enter the email used for your bookings"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Sending code...' : 'Send Verification Code'}
      </button>
    </form>
  )
}

interface VerifyCodeFormProps {
  email: string
  onSuccess: (token: string) => void
  onBack: () => void
}

function VerifyCodeForm({ email, onSuccess, onBack }: VerifyCodeFormProps) {
  const { showToast } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<GuestVerifyData>({
    resolver: zodResolver(guestVerifySchema),
    defaultValues: { email }
  })

  const onSubmit = async (data: GuestVerifyData) => {
    try {
      const response = await apiClient.post<GuestAccessResponse>('/v1/guest/access/verify', data)
      onSuccess(response.data.session_token)
    } catch (error: any) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message
      
      if (status === 401) {
        showToast('Invalid verification code', 'error')
      } else if (status === 422) {
        showToast(message, 'error')
      } else {
        showToast('Verification failed. Please try again.', 'error')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          We sent a verification code to:
        </p>
        <p className="font-medium text-gray-900">{email}</p>
      </div>

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
          Verification Code
        </label>
        <input
          {...register('code')}
          type="text"
          id="code"
          placeholder="Enter the 6-digit code"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-wider"
          maxLength={6}
        />
        {errors.code && <p className="text-sm text-red-600 mt-1">{errors.code.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Verifying...' : 'Verify Code'}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-gray-600 hover:text-gray-800 underline"
      >
        Use a different email
      </button>
    </form>
  )
}