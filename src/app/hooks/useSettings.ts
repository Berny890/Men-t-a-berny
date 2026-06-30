import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type MenuMode = 'simple' | 'reservations' | 'whatsapp';

export interface Settings {
  menuMode: MenuMode;
  menuSubtitle: string;
  menuPortions: string;
  baseUrl: string;
  whatsappNumber: string;
  whatsappMessageTemplate: string;
}

export const WHATSAPP_DEFAULT_TEMPLATE =
  '¡Hola Bernardita! ¿Qué tal estás? Te quiero encargar para {fecha} un plato de {plato}. Mi dirección es la siguiente: ';

const DEFAULTS: Settings = {
  menuMode: 'simple',
  menuSubtitle: 'EMPRENDIMIENTO FAMILIAR',
  menuPortions: 'Porciones para 6 personas',
  baseUrl: '',
  whatsappNumber: '',
  whatsappMessageTemplate: WHATSAPP_DEFAULT_TEMPLATE,
};

const KEY_MAP: Record<keyof Settings, string> = {
  menuMode: 'menu_mode',
  menuSubtitle: 'menu_subtitle',
  menuPortions: 'menu_portions',
  baseUrl: 'base_url',
  whatsappNumber: 'whatsapp_number',
  whatsappMessageTemplate: 'whatsapp_message_template',
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
      const legacyMode: MenuMode = map['reservations_enabled'] === 'true' ? 'reservations' : 'simple';
      setSettings({
        menuMode: (map['menu_mode'] as MenuMode) ?? legacyMode,
        menuSubtitle: map['menu_subtitle'] ?? DEFAULTS.menuSubtitle,
        menuPortions: map['menu_portions'] ?? DEFAULTS.menuPortions,
        baseUrl: map['base_url'] ?? DEFAULTS.baseUrl,
        whatsappNumber: map['whatsapp_number'] ?? DEFAULTS.whatsappNumber,
        whatsappMessageTemplate: map['whatsapp_message_template'] ?? DEFAULTS.whatsappMessageTemplate,
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
