import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'
import { registerSchema, loginSchema, type RegisterData, type LoginData } from '../lib/schemas'
import { Button } from './ui/Button'

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [successEmail, setSuccessEmail] = useState('')

  if (registrationSuccess) {
    return <RegistrationSuccessScreen email={successEmail} onContinue={() => {
      setRegistrationSuccess(false)
      setActiveTab('signin')
    }} />
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'signin'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('signin')}
        >
          Sign In
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'signup'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('signup')}
        >
          Sign Up
        </button>
      </div>

      {activeTab === 'signin' ? <SignInForm /> : <SignUpForm onSuccess={(email) => {
        setSuccessEmail(email)
        setRegistrationSuccess(true)
      }} />}
    </div>
  )
}

interface RegistrationSuccessScreenProps {
  email: string
  onContinue: () => void
}

function RegistrationSuccessScreen({ email, onContinue }: RegistrationSuccessScreenProps) {
  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-green-600 text-6xl mb-6">✓</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
        <p className="text-gray-600 mb-6">
          We've sent a verification email to:
        </p>
        <p className="font-semibold text-gray-900 bg-gray-50 px-4 py-2 rounded-lg mb-6">
          {email}
        </p>
        <p className="text-gray-600 mb-8">
          Please check your email and click the verification link to activate your account.
        </p>
        <Button onClick={onContinue} className="w-full" size="lg">
          Continue to Sign In
        </Button>
      </div>
    </div>
  )
}
function SignInForm() {
  const { login, isLoggingIn } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = (data: LoginData) => {
    login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          id="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
      </div>

      <Button
        type="submit"
        isLoading={isLoggingIn}
        className="w-full"
      >
        Sign In
      </Button>
    </form>
  )
}

interface SignUpFormProps {
  onSuccess: (email: string) => void
}

function SignUpForm({ onSuccess }: SignUpFormProps) {
  const { register: registerUser, isRegistering } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterData) => {
    registerUser(data, {
      onSuccess: () => onSuccess(data.email)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          {...register('name')}
          type="text"
          id="name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          {...register('email')}
          type="email"
          id="email-signup"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          {...register('phone')}
          type="tel"
          id="phone"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          id="password-signup"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
      </div>

      <Button
        type="submit"
        isLoading={isRegistering}
        variant="secondary"
        className="w-full"
      >
        Create Account
      </Button>
    </form>
  )
}