import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../hooks/useAuth'
import { guestRequestSchema, guestVerifySchema, type GuestRequestData, type GuestVerifyData } from '../lib/schemas'
import { Button } from './ui/Button'

export function GuestAccessForm() {
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [email, setEmail] = useState('')

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
  const { requestAccess, isRequestingAccess } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<GuestRequestData>({
    resolver: zodResolver(guestRequestSchema)
  })

  const onSubmit = (data: GuestRequestData) => {
    requestAccess(data.email, {
      onSuccess: () => onSuccess(data.email)
    })
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

      <Button
        type="submit"
        isLoading={isRequestingAccess}
        className="w-full"
      >
        Send Verification Code
      </Button>
    </form>
  )
}

interface VerifyCodeFormProps {
  email: string
  onBack: () => void
}

function VerifyCodeForm({ email, onBack }: VerifyCodeFormProps) {
  const { verifyAccess, isVerifyingAccess } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<GuestVerifyData>({
    resolver: zodResolver(guestVerifySchema),
    defaultValues: { email }
  })

  const onSubmit = (data: GuestVerifyData) => {
    verifyAccess(data)
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

      <Button
        type="submit"
        isLoading={isVerifyingAccess}
        className="w-full"
      >
        Verify Code
      </Button>

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