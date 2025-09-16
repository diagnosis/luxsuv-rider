import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  name: string
  email: string
  phone: string
  role: string
  is_verified: boolean
}

interface AuthStore {
  // Rider auth
  jwt: string | null
  user: User | null
  
  // Guest auth
  guestSessionToken: string | null
  guestEmail: string | null
  
  // Actions
  setRiderAuth: (jwt: string, user: User) => void
  setGuestAuth: (token: string, email: string) => void
  clearRiderAuth: () => void
  clearGuestAuth: () => void
  clearAll: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      jwt: null,
      user: null,
      guestSessionToken: null,
      guestEmail: null,
      
      setRiderAuth: (jwt, user) => set({ jwt, user }),
      setGuestAuth: (token, email) => set({ guestSessionToken: token, guestEmail: email }),
      clearRiderAuth: () => set({ jwt: null, user: null }),
      clearGuestAuth: () => set({ guestSessionToken: null, guestEmail: null }),
      clearAll: () => set({ jwt: null, user: null, guestSessionToken: null, guestEmail: null }),
    }),
    {
      name: 'auth-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Clear old state if version mismatch
          return {
            jwt: null,
            user: null,
            guestSessionToken: null,
            guestEmail: null,
          }
        }
        return persistedState
      },
    }
  )
)