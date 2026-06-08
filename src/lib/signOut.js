import { supabase } from './supabase';

export const handleSignOut = async () => {
  await supabase.auth.signOut();
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/';
};
