import { useState, FormEvent } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LoginGate = ({ children }: { children: React.ReactNode }) => {
  const { unlocked, login } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  if (unlocked) return <>{children}</>;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError(false);
    const ok = await login(password);
    setChecking(false);
    if (!ok) {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6ec', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <form onSubmit={handleSubmit} style={{
        maxWidth: '360px', width: '100%', textAlign: 'center',
        background: '#fffaf3', border: '1px solid #e8d5c0',
        borderRadius: '16px', padding: '40px 32px', fontFamily: 'Georgia, serif',
      }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%', background: '#f5e6d3',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
        }}>
          <Lock size={24} style={{ color: '#8b2635' }} />
        </div>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c1810', marginBottom: '6px' }}>
          Gestión de Menú
        </h1>
        <p style={{ fontSize: '13px', color: '#7a5c4e', marginBottom: '20px' }}>
          Ingresa la clave para continuar
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          autoFocus
          style={{
            width: '100%', padding: '12px 14px', borderRadius: '10px',
            border: error ? '1.5px solid #dc2626' : '1.5px solid #e8d5c0',
            background: '#fff', color: '#2c1810', fontSize: '15px', outline: 'none',
            fontFamily: 'Georgia, serif', boxSizing: 'border-box', textAlign: 'center',
            letterSpacing: '2px', marginBottom: '14px',
          }}
        />
        {error && (
          <p style={{ color: '#dc2626', fontSize: '12px', marginBottom: '14px', marginTop: '-6px' }}>
            Clave incorrecta. Intenta de nuevo.
          </p>
        )}
        <button
          type="submit"
          disabled={checking || !password}
          style={{
            width: '100%', padding: '12px', borderRadius: '10px',
            background: (checking || !password) ? '#e8d5c0' : '#8b2635',
            color: (checking || !password) ? '#7a5c4e' : '#fff',
            fontSize: '15px', fontWeight: 'bold', border: 'none',
            cursor: (checking || !password) ? 'not-allowed' : 'pointer',
            fontFamily: 'Georgia, serif',
          }}
        >
          {checking ? 'Verificando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};
