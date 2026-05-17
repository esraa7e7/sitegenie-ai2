import { useState, useEffect } from 'react';
import { supabase, getSession, signOut } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setLoading(false);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { success, error } = await signOut();
    if (success) {
      setSession(null);
    }
    return { success, error };
  };

  return { session, loading, signOut: handleSignOut };
};
