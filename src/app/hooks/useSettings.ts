import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface Settings {
  reservationsEnabled: boolean;
  menuSubtitle: string;
  menuPortions: string;
  baseUrl: string;
}

const DEFAULTS: Settings = {
  reservationsEnabled: false,
  menuSubtitle: 'EMPRENDIMIENTO FAMILIAR',
  menuPortions: 'Porciones para 6 personas',
  baseUrl: '',
};

const KEY_MAP: Record<keyof Settings, string> = {
  reservationsEnabled: 'reservations_enabled',
  menuSubtitle: 'menu_subtitle',
  menuPortions: 'menu_portions',
  baseUrl: 'base_url',
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('settings').select('key, value');
    if (data) {
      const map: Record<string, string> = {};
      data.forEach((row) => { map[row.key] = row.value; });
      setSettings({
        reservationsEnabled: map['reservations_enabled'] === 'true',
        menuSubtitle: map['menu_subtitle'] ?? DEFAULTS.menuSubtitle,
        menuPortions: map['menu_portions'] ?? DEFAULTS.menuPortions,
        baseUrl: map['base_url'] ?? DEFAULTS.baseUrl,
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateSettings = async (updates: Partial<Settings>) => {
    const next = { ...settings, ...updates };
    setSettings(next);
    const rows = (Object.keys(updates) as (keyof Settings)[]).map((k) => ({
      key: KEY_MAP[k],
      value: String(next[k]),
    }));
    await Promise.all(
      rows.map((row) =>
        supabase.from('settings').upsert(row, { onConflict: 'key' })
      )
    );
  };

  return { settings, loading, updateSettings };
};
