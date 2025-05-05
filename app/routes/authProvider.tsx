// src/components/AuthProvider.tsx (or in your _app.tsx or Layout component)
import React, { useState, useEffect, createContext, useContext } from 'react';
import { type User, onAuthStateChanged, getRedirectResult } from 'firebase/auth';
import { auth } from "../client/firebase.client"
import { useFetcher } from 'react-router';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start loading until auth state is determined

  const fetcher = useFetcher()

  useEffect(() => {
    // First, check for redirect result ONLY ONCE on initial load
    let isProcessingRedirect = true; // Flag to avoid double processing
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // User signed in via redirect. `onAuthStateChanged` will also fire.
          console.log('Redirect Result Processed:', result.user.displayName);
          // setUser(result.user); // Often redundant as onAuthStateChanged handles it

          result.user.getIdToken()
            .then((idToken) => {
              fetcher.submit({ idToken }, { method: "post", action: "/login" })
            })

        }
      })
      .catch((error) => {
        // Handle errors from redirect result processing
        console.error('Error getting redirect result:', error);
      })
      .finally(() => {
        isProcessingRedirect = false; // Mark redirect processing as done
        // Set loading false *after* redirect check if not waiting for onAuthStateChanged
        // setLoading(false); // See note below
      });

    // Then, set up the persistent auth state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth State Changed:', currentUser?.displayName ?? 'No user');
      setUser(currentUser);
      // Set loading false once the listener gives the initial state,
      // but ensure redirect processing attempt is complete.
      if (!isProcessingRedirect) {
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs once on mount

  // Optional: Add logic here to send ID token to server when user state changes to logged in

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);