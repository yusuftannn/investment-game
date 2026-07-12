import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '../../config/supabase';

export const authService = {
  signInWithEmail: async (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  signUpWithEmail: async (email: string, password: string) =>
    supabase.auth.signUp({ email, password }),
  signOut: async () => supabase.auth.signOut(),
  getSession: async () => supabase.auth.getSession(),
  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) =>
    supabase.auth.onAuthStateChange(callback),
};
