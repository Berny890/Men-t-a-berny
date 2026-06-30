import { useState, useEffect } from 'react';
import { Settings as SettingsType, MenuMode, WHATSAPP_DEFAULT_TEMPLATE } from '../hooks/useSettings';

const formatPreviewDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  const weekday = date.toLocaleDateString('es-CL', { weekday: 'long' }).toLowerCase();
  const month = date.toLocaleDateString('es-CL', { month: 'long' }).toLowerCase();
  return `${weekday} ${date.getDate()} de ${month}`;
};

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

interface SettingsManagerProps {
  settings: SettingsType;
  loading: boolean;
  updateSettings: (updates: Partial<SettingsType>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
}

export const SettingsManager = ({ settings, loading, updateSettings, changePassword }: SettingsManagerProps) => {
  const [subtitle, setSubtitle] = useState('');
  const [portions, setPortions] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [whatsappTemplate, setWhatsappTemplate] = useState('');
  const [privacyContact, setPrivacyContact] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!loading) {
      setSubtitle(settings.menuSubtitle);
      setPortions(settings.menuPortions);
      setWhatsappNumber(settings.whatsappNumber);
      setWhatsappTemplate(settings.whatsappMessageTemplate);
      setPrivacyContact(settings.privacyContact);
    }
  }, [loading, settings]);

  const handleModeChange = async (mode: MenuMode) => {
    await updateSettings({ menuMode: mode });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMessage(null);
    if (newPassword.length < 6) {
      setPwMessage({ type: 'error', text: 'La nueva clave debe tener al menos 6 caracteres.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMessage({ type: 'error', text: 'Las claves nuevas no coinciden.' });
      return;
    }
    setPwSaving(true);
    const ok = await changePassword(oldPassword, newPassword);
    setPwSaving(false);
    if (ok) {
      setPwMessage({ type: 'ok', text: 'Clave actualizada correctamente.' });
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    } else {
      setPwMessage({ type: 'error', text: 'La clave actual no es correcta.' });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await updateSettings({
      menuSubtitle: subtitle,
      menuPortions: portions,
      whatsappNumber: whatsappNumber.replace(/[^\d]/g, ''),
      whatsappMessageTemplate: whatsappTemplate,
      privacyContact: privacyContact.trim(),
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
    .replace('{fecha}', formatPreviewDate())
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
                Con código de país, solo números. Ej: 569XXXXXXXX
              </p>
              <input
                type="text" value={whatsappNumber} placeholder="569XXXXXXXX"
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
              Ej: "Porciones para seis personas"
            </p>
            <input
              type="text" value={portions}
              onChange={(e) => setPortions(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Contacto para privacidad de datos</label>
            <p style={{ fontSize: '12px', color: '#7a5c4e', margin: '0 0 8px' }}>
              Correo o WhatsApp que verán los clientes en la política de privacidad para ejercer sus derechos sobre sus datos. Ej: "correo@ejemplo.com" o "WhatsApp +56 9 1234 5678"
            </p>
            <input
              type="text" value={privacyContact} placeholder="correo@ejemplo.com"
              onChange={(e) => setPrivacyContact(e.target.value)}
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

      {/* Seguridad */}
      <div style={{
        background: '#fffaf3', border: '1px solid #e8d5c0',
        borderRadius: '16px', overflow: 'hidden', marginTop: '20px',
      }}>
        <div style={{ background: '#f5e6d3', borderBottom: '1px solid #e8d5c0', padding: '16px 24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c1810', margin: 0 }}>
            Seguridad
          </h2>
        </div>
        <form onSubmit={handleChangePassword} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: '13px', color: '#7a5c4e', margin: 0, lineHeight: '1.5' }}>
            Cambia la clave de acceso al panel de administración.
          </p>

          <div>
            <label style={labelStyle}>Clave actual</label>
            <input
              type="password" value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={inputStyle}
              autoComplete="current-password"
            />
          </div>

          <div>
            <label style={labelStyle}>Clave nueva</label>
            <input
              type="password" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label style={labelStyle}>Confirmar clave nueva</label>
            <input
              type="password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
              autoComplete="new-password"
            />
          </div>

          {pwMessage && (
            <p style={{ fontSize: '13px', fontWeight: 'bold', margin: 0, color: pwMessage.type === 'ok' ? '#166534' : '#dc2626' }}>
              {pwMessage.text}
            </p>
          )}

          <button
            type="submit"
            disabled={pwSaving || !oldPassword || !newPassword || !confirmPassword}
            style={{
              padding: '11px 24px', borderRadius: '10px', border: 'none',
              background: (pwSaving || !oldPassword || !newPassword || !confirmPassword) ? '#e8d5c0' : '#8b2635',
              color: (pwSaving || !oldPassword || !newPassword || !confirmPassword) ? '#7a5c4e' : '#fff',
              fontSize: '14px', fontWeight: 'bold',
              cursor: pwSaving ? 'wait' : 'pointer', fontFamily: 'Georgia, serif',
              alignSelf: 'flex-start', transition: 'background 0.2s',
            }}
          >
            {pwSaving ? 'Cambiando...' : 'Cambiar clave'}
          </button>
        </form>
      </div>
    </div>
  );
};
