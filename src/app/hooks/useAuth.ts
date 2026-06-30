import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'menu_admin_unlocked';

export const useAuth = () => {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(STORAGE_KEY) === 'true');

  const login = useCallback(async (password: string): Promise<boolean> => {
    const { data, error } = await supabase.rpc('verify_admin_password', { input: password });
    if (error || !data) return false;
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setUnlocked(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUnlocked(false);
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string): Promise<boolean> => {
    const { data, error } = await supabase.rpc('set_admin_password', { old_password: oldPassword, new_password: newPassword });
    if (error) return false;
    return Boolean(data);
  }, []);

  return { unlocked, login, logout, changePassword };
};
