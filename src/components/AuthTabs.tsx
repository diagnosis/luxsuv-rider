import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/api'
import { registerSchema, loginSchema, type RegisterData, type LoginData } from '../lib/schemas'
import { useAuthStore } from '../store/auth'
import { useToast } from './ui/Toast'
import type { LoginResponse } from '../lib/api-types'

export function AuthTabs() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const navigate = useNavigate()
  const { setRiderAuth } = useAuthStore()
  const { showToast } = useToast()

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

      {activeTab === 'signin' ? <SignInForm /> : <SignUpForm />}
    </div>
  )
}

function SignInForm() {
  const navigate = useNavigate()
  const { setRiderAuth } = useAuthStore()
  const { showToast } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginData) => {
    try {
      const response = await apiClient.post<LoginResponse>('/v1/auth/login', data)
      setRiderAuth(response.data.access_token, response.data.user)
      showToast('Welcome back!', 'success')
      navigate('/bookings')
    } catch (error: any) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message
      
      if (status === 401) {
        showToast('Invalid email or password', 'error')
      } else if (status === 422) {
        showToast(message, 'error')
      } else {
        showToast('Login failed. Please try again.', 'error')
      }
    }
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}

function SignUpForm() {
  const { showToast } = useToast()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterData) => {
    try {
      await apiClient.post('/v1/auth/register', data)
      showToast('Registration successful! Check your email to verify your account.', 'success')
    } catch (error: any) {
      const status = error.response?.status
      const message = error.response?.data?.message || error.message
      
      if (status === 400) {
        showToast('Please check your input and try again', 'error')
      } else if (status === 422) {
        showToast(message, 'error')
      } else {
        showToast('Registration failed. Please try again.', 'error')
      }
    }
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  )
}