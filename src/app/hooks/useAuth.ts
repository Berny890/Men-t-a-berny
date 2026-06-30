import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'menu_admin_session';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(STORAGE_KEY));

  const login = useCallback(async (password: string): Promise<boolean> => {
    const { data, error } = await supabase.rpc('create_admin_session', { input: password });
    if (error || !data) return false;
    sessionStorage.setItem(STORAGE_KEY, data);
    setToken(data);
    return true;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string): Promise<boolean> => {
    const { data, error } = await supabase.rpc('set_admin_password', { old_password: oldPassword, new_password: newPassword });
    if (error) return false;
    return Boolean(data);
  }, []);

  return { unlocked: Boolean(token), token, login, logout, changePassword };
};
