import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    // Force loading to complete after 2 seconds max
    timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('Session check timeout - forcing load completion');
        setLoading(false);
      }
    }, 2000);

    // Check existing session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (error) {
          console.error('Error getting session:', error);
          setSession(null);
        } else {
          setSession(data.session || null);
          
          if (data.session?.user) {
            // Fetch user from database asynchronously - don't wait
            (async () => {
              try {
                const { data: userData } = await supabase
                  .from('users')
                  .select('*')
                  .eq('id', data.session.user.id)
                  .maybeSingle();
                
                if (isMounted && userData) {
                  setUser(userData);
                }
              } catch (err) {
                console.error('Error fetching user:', err);
              }
            })();
          }
        }
      } catch (err) {
        console.error('Error checking session:', err);
        if (isMounted) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          clearTimeout(timeoutId);
        }
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;

        setSession(session);
        
        if (session?.user) {
          // Fire off user fetch in background
          (async () => {
            try {
              const { data: userData } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (isMounted && userData) {
                setUser(userData);
              }
            } catch (err) {
              console.error('Error fetching user:', err);
            }
          })();
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      
      // Sign up the user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Try to create user record in database, but don't fail if it doesn't work
        // The database trigger should handle this automatically
        try {
          const { error: dbError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: data.user.email,
              name: name,
            })
            .select();

          // Log warnings but don't throw - signup should still succeed
          if (dbError) {
            console.warn('Warning: Could not create user profile in database:', dbError.message);
            // Don't throw - the trigger may create it, or user will be created on next login
          }
        } catch (dbErr: any) {
          console.warn('Warning: Database error (non-critical):', dbErr.message);
          // Silently fail - user signup in auth succeeded, which is the important part
        }
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      
      // Don't wait for user profile loading - let it load in background
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      setUser(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
