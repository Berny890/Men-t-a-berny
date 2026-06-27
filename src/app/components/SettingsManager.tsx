import { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';

export const SettingsManager = () => {
  const { settings, loading, updateSettings } = useSettings();

  const [subtitle, setSubtitle] = useState('');
  const [portions, setPortions] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading) {
      setSubtitle(settings.menuSubtitle);
      setPortions(settings.menuPortions);
    }
  }, [loading, settings]);

  const handleToggle = async () => {
    await updateSettings({ reservationsEnabled: !settings.reservationsEnabled });
  };

  const handleSaveTexts = async () => {
    setSaving(true);
    await updateSettings({ menuSubtitle: subtitle, menuPortions: portions });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '1.5px solid #e8d5c0', background: '#fff',
    color: '#2c1810', fontSize: '14px', outline: 'none',
    fontFamily: 'Georgia, serif', boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '6px',
    fontSize: '13px', fontWeight: '600', color: '#7a5c4e',
    fontFamily: 'Georgia, serif',
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: '#7a5c4e', fontFamily: 'Georgia, serif' }}>
        Cargando configuración...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      {/* Reservas toggle */}
      <div style={{
        background: '#fffaf3', border: '1px solid #e8d5c0',
        borderRadius: '16px', overflow: 'hidden', marginBottom: '20px',
      }}>
        <div style={{ background: '#f5e6d3', borderBottom: '1px solid #e8d5c0', padding: '16px 24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c1810', margin: 0 }}>
            Sistema de reservas
          </h2>
        </div>
        <div style={{ padding: '24px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#fdf6ec', border: '1.5px solid #e8d5c0',
            borderRadius: '12px', padding: '20px 24px', gap: '16px',
          }}>
            <div>
              <p style={{ fontWeight: 'bold', color: '#2c1810', fontSize: '15px', margin: '0 0 6px' }}>
                Permitir reservas de clientes
              </p>
              <p style={{ color: '#7a5c4e', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                Cuando está activado, los clientes pueden reservar platos desde el link público.
                Al desactivarlo, la página de reserva mostrará un mensaje de no disponibilidad.
              </p>
            </div>
            <button
              onClick={handleToggle}
              style={{
                flexShrink: 0,
                width: '60px', height: '32px', borderRadius: '20px',
                background: settings.reservationsEnabled ? '#8b2635' : '#e8d5c0',
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background 0.2s',
              }}
            >
              <span style={{
                position: 'absolute', top: '4px',
                left: settings.reservationsEnabled ? '30px' : '4px',
                width: '24px', height: '24px', borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
          <p style={{
            marginTop: '12px', fontSize: '13px', fontWeight: 'bold',
            color: settings.reservationsEnabled ? '#166534' : '#7a5c4e',
          }}>
            Estado actual: {settings.reservationsEnabled ? '✅ Reservas habilitadas' : '🔒 Reservas deshabilitadas'}
          </p>
        </div>
      </div>

      {/* Textos del menú */}
      <div style={{
        background: '#fffaf3', border: '1px solid #e8d5c0',
        borderRadius: '16px', overflow: 'hidden',
      }}>
        <div style={{ background: '#f5e6d3', borderBottom: '1px solid #e8d5c0', padding: '16px 24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c1810', margin: 0 }}>
            Textos y configuración del menú
          </h2>
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Subtítulo del menú</label>
            <p style={{ fontSize: '12px', color: '#7a5c4e', margin: '0 0 8px' }}>
              Aparece bajo el título "MENÚ" en el PDF y la vista previa.
            </p>
            <input
              type="text" value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Texto de porciones</label>
            <p style={{ fontSize: '12px', color: '#7a5c4e', margin: '0 0 8px' }}>
              Ej: "Porciones para 6 personas"
            </p>
            <input
              type="text" value={portions}
              onChange={(e) => setPortions(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            onClick={handleSaveTexts}
            disabled={saving}
            style={{
              padding: '11px 24px', borderRadius: '10px', border: 'none',
              background: saved ? '#166534' : '#8b2635',
              color: '#fff', fontSize: '14px', fontWeight: 'bold',
              cursor: saving ? 'wait' : 'pointer', fontFamily: 'Georgia, serif',
              alignSelf: 'flex-start', transition: 'background 0.2s',
            }}
          >
            {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
};
