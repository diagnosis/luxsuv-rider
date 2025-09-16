import { apiRequest } from './client'

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone: string
}

export interface RegisterResponse {
  message: string
  dev_verify_url?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface User {
  id: number
  email: string
  name: string
  phone: string
  role: string
  is_verified: boolean
}

export interface LoginResponse {
  access_token: string
  user: User
}

export interface VerifyEmailResponse {
  message: string
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  return apiRequest<VerifyEmailResponse>(`/v1/auth/verify-email?token=${encodeURIComponent(token)}`, {
    method: 'POST',
  })
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}