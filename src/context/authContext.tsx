import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

type AuthContextType = {
  user: User | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    let mounted = true

    const initUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (!mounted) return

      if (error) {
        setUser(null)
      } else {
        setUser(data.user)
      }
    }

    initUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
