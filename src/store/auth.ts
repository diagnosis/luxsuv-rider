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
      
      setRiderAuth: (jwt, user) => {
        console.log('Setting rider auth:', { jwt: jwt?.substring(0, 10) + '...', user: user.email })
        set({ jwt, user, guestSessionToken: null, guestEmail: null })
      },
      
      setGuestAuth: (token, email) => {
        console.log('Setting guest auth:', { email })
        set({ guestSessionToken: token, guestEmail: email, jwt: null, user: null })
      },
      
      clearRiderAuth: () => {
        console.log('Clearing rider auth')
        set({ jwt: null, user: null })
      },
      
      clearGuestAuth: () => {
        console.log('Clearing guest auth')
        set({ guestSessionToken: null, guestEmail: null })
      },
      
      clearAll: () => {
        console.log('Clearing all auth')
        set({ 
          jwt: null, 
          user: null, 
          guestSessionToken: null, 
          guestEmail: null 
        })
      },
    }),
    {
      name: 'auth-storage',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        console.log('Migrating auth store from version:', version)
        // Clear everything on version mismatch
        if (version < 2) {
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