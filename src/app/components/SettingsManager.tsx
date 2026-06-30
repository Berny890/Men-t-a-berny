import { useState, useEffect } from 'react';
import { useSettings, MenuMode, WHATSAPP_DEFAULT_TEMPLATE } from '../hooks/useSettings';

const MODE_OPTIONS: { value: MenuMode; title: string; description: string }[] = [
  {
    value: 'simple',
    title: 'Menú simple',
    description: 'Solo el menú, sin botones de reserva ni de WhatsApp.',
  },
  {
    value: 'reservations',
    title: 'Sistema de reservas',
    description: 'El cliente llena un formulario y la reserva queda guardada en el panel de Reservas.',
  },
  {
    value: 'whatsapp',
    title: 'WhatsApp directo',
    description: 'Al tocar un plato se abre WhatsApp con un mensaje ya escrito, listo para enviar.',
  },
];

export const SettingsManager = () => {
  const { settings, loading, updateSettings } = useSettings();

  const [subtitle, setSubtitle] = useState('');
  const [portions, setPortions] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappTemplate, setWhatsappTemplate] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading) {
      setSubtitle(settings.menuSubtitle);
      setPortions(settings.menuPortions);
      setWhatsappNumber(settings.whatsappNumber);
      setWhatsappTemplate(settings.whatsappMessageTemplate);
    }
  }, [loading, settings]);

  const handleModeChange = async (mode: MenuMode) => {
    await updateSettings({ menuMode: mode });
  };

  const handleSave = async () => {
    setSaving(true);
    await updateSettings({
      menuSubtitle: subtitle,
      menuPortions: portions,
      whatsappNumber: whatsappNumber.replace(/[^\d]/g, ''),
      whatsappMessageTemplate: whatsappTemplate,
    });
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

  const previewMessage = whatsappTemplate
    .replace('{fecha}', 'sábado 5 de julio de 2026')
    .replace('{plato}', 'Lasaña de Carne');

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      {/* Selector de modo */}
      <div style={{
        background: '#fffaf3', border: '1px solid #e8d5c0',
        borderRadius: '16px', overflow: 'hidden', marginBottom: '20px',
      }}>
        <div style={{ background: '#f5e6d3', borderBottom: '1px solid #e8d5c0', padding: '16px 24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c1810', margin: 0 }}>
            Modo del menú
          </h2>
        </div>
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {MODE_OPTIONS.map((opt) => {
            const active = settings.menuMode === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleModeChange(opt.value)}
                style={{
                  textAlign: 'left', padding: '16px 20px', borderRadius: '12px',
                  background: active ? '#fdf6ec' : '#fff',
                  border: active ? '2px solid #8b2635' : '1.5px solid #e8d5c0',
                  cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '14px',
                  fontFamily: 'Georgia, serif',
                }}
              >
                <span style={{
                  flexShrink: 0, marginTop: '2px',
                  width: '18px', height: '18px', borderRadius: '50%',
                  border: active ? '5.5px solid #8b2635' : '1.5px solid #c4a882',
                  background: '#fff', boxSizing: 'border-box',
                }} />
                <span>
                  <p style={{ fontWeight: 'bold', color: '#2c1810', fontSize: '14.5px', margin: '0 0 4px' }}>
                    {opt.title}
                  </p>
                  <p style={{ color: '#7a5c4e', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                    {opt.description}
                  </p>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuración WhatsApp */}
      {settings.menuMode === 'whatsapp' && (
        <div style={{
          background: '#fffaf3', border: '1px solid #e8d5c0',
          borderRadius: '16px', overflow: 'hidden', marginBottom: '20px',
        }}>
          <div style={{ background: '#f5e6d3', borderBottom: '1px solid #e8d5c0', padding: '16px 24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c1810', margin: 0 }}>
              Configuración de WhatsApp
            </h2>
          </div>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Número de WhatsApp que recibe los encargos</label>
              <p style={{ fontSize: '12px', color: '#7a5c4e', margin: '0 0 8px' }}>
                Con código de país, solo números. Ej: 56977289027
              </p>
              <input
                type="text" value={whatsappNumber} placeholder="56977289027"
                onChange={(e) => setWhatsappNumber(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Mensaje predeterminado</label>
              <p style={{ fontSize: '12px', color: '#7a5c4e', margin: '0 0 8px' }}>
                Usa <code style={{ background: '#f5e6d3', padding: '1px 5px', borderRadius: '4px' }}>{'{fecha}'}</code> y{' '}
                <code style={{ background: '#f5e6d3', padding: '1px 5px', borderRadius: '4px' }}>{'{plato}'}</code> donde quieras que aparezcan automáticamente.
              </p>
              <textarea
                value={whatsappTemplate}
                onChange={(e) => setWhatsappTemplate(e.target.value)}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
              />
              <button
                onClick={() => setWhatsappTemplate(WHATSAPP_DEFAULT_TEMPLATE)}
                style={{
                  marginTop: '8px', background: 'none', border: 'none',
                  color: '#8b2635', fontSize: '12px', cursor: 'pointer',
                  fontFamily: 'Georgia, serif', textDecoration: 'underline', padding: 0,
                }}
              >
                Restaurar mensaje por defecto
              </button>
            </div>

            <div style={{ background: '#fdf6ec', border: '1.5px solid #e8d5c0', borderRadius: '10px', padding: '14px 16px' }}>
              <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#7a5c4e', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Vista previa
              </p>
              <p style={{ fontSize: '13px', color: '#2c1810', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {previewMessage}
              </p>
            </div>
          </div>
        </div>
      )}

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
            onClick={handleSave}
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
