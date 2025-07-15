import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { useAppStore } from './store'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { setUser: setStoreUser, logout: logoutStore } = useAppStore()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setStoreUser(session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
        role: 'user',
        createdAt: new Date(session.user.created_at),
        updatedAt: new Date(),
        profile: {
          bio: '',
          location: '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          preferences: {
            theme: 'dark',
            notifications: {
              email: true,
              push: true,
              sms: false,
              reportAlerts: true,
              communityUpdates: true,
              impactUpdates: true,
            },
            privacy: {
              profileVisibility: 'public',
              locationSharing: true,
              dataSharing: true,
            },
            language: 'en',
          },
          stats: {
            totalReports: 0,
            totalPoints: 0,
            treesPlanted: 0,
            co2Saved: 0,
            impactScore: 0,
            rank: 0,
            badges: [],
          },
        },
      } : null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        setStoreUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
          role: 'user',
          createdAt: new Date(session.user.created_at),
          updatedAt: new Date(),
          profile: {
            bio: '',
            location: '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            preferences: {
              theme: 'dark',
              notifications: {
                email: true,
                push: true,
                sms: false,
                reportAlerts: true,
                communityUpdates: true,
                impactUpdates: true,
              },
              privacy: {
                profileVisibility: 'public',
                locationSharing: true,
                dataSharing: true,
              },
              language: 'en',
            },
            stats: {
              totalReports: 0,
              totalPoints: 0,
              treesPlanted: 0,
              co2Saved: 0,
              impactScore: 0,
              rank: 0,
              badges: [],
            },
          },
        })
      } else {
        logoutStore()
      }
    })

    return () => subscription.unsubscribe()
  }, [setStoreUser, logoutStore])

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      logoutStore()
    }
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password,
    })
    return { data, error }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  }
}

export function useRequireAuth() {
  const { user, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login page
      window.location.href = '/auth/login'
    }
  }, [user, loading])

  return { user, loading }
} 