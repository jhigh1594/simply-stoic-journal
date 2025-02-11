import React from 'react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

interface AuthContextType {
  userId: string | null;
  isLoading: boolean;
}

export const AuthContext = React.createContext<AuthContextType>({
  userId: null,
  isLoading: true
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [retryCount, setRetryCount] = React.useState(0);

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // For development, automatically sign in
  React.useEffect(() => {
    if (!userId && !isLoading) {
      const signIn = async () => {
        try {
          // Try to sign in first
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: 'user@example.com',
            password: 'password123'
          });

          // If sign in fails with invalid credentials, try to create the user
          if (signInError?.message === 'Invalid login credentials') {
            const { error: signUpError } = await supabase.auth.signUp({
              email: 'user@example.com',
              password: 'password123'
            });

            // If signup fails with user exists, try signing in again
            if (signUpError?.message === 'User already registered') {
              const { error: retrySignInError } = await supabase.auth.signInWithPassword({
                email: 'user@example.com',
                password: 'password123'
              });

              if (retrySignInError) {
                throw retrySignInError;
              }
            } else if (signUpError) {
              throw signUpError;
            }
          } else if (signInError) {
            throw signInError;
          }

          // Reset retry count on success
          setRetryCount(0);
        } catch (err) {
          console.error('Auth attempt failed:', err);
          
          // Implement retry logic for network errors
          if (retryCount < MAX_RETRIES) {
            setRetryCount(prev => prev + 1);
            setTimeout(() => {
              signIn();
            }, RETRY_DELAY * Math.pow(2, retryCount)); // Exponential backoff
          } else {
            console.error('Max retries reached. Please check your connection and try again.');
          }
        }
      };

      signIn();
    }
  }, [userId, isLoading, retryCount]);

  return (
    <AuthContext.Provider value={{ userId, isLoading }}>
      {isLoading ? (
        <div className="fixed inset-0 bg-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600">
              {retryCount > 0 ? `Connecting... Attempt ${retryCount}/${MAX_RETRIES}` : 'Loading...'}
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}