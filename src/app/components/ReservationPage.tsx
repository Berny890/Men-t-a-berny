import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { CalendarDays, Lock, UtensilsCrossed, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DishInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

const formatDateSpanish = (dateStr: string): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).toLowerCase();
};

export default function ReservationPage() {
  const { dishId } = useParams<{ dishId: string }>();
  const [searchParams] = useSearchParams();
  const fecha = searchParams.get('fecha') || '';

  const [dish, setDish] = useState<DishInfo | null>(null);
  const [reservationsEnabled, setReservationsEnabled] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      const [{ data: settingRow }, { data: dishRow }] = await Promise.all([
        supabase.from('settings').select('value').eq('key', 'menu_mode').single(),
        supabase.from('dishes').select('id, name, description, price, available').eq('id', dishId!).single(),
      ]);
      setReservationsEnabled(settingRow?.value === 'reservations');
      if (!dishRow) {
        setNotFound(true);
      } else {
        setDish(dishRow as DishInfo);
      }
      setPageLoading(false);
    };
    init();
  }, [dishId]);

  const handleReserve = () => {
    if (!customerName.trim() || !address.trim() || !contact.trim()) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!dish) return;
    setSubmitting(true);
    await supabase.from('reservations').insert({
      id: Date.now().toString(),
      dish_id: dish.id,
      dish_name: dish.name,
      quantity,
      customer_name: customerName.trim(),
      address: address.trim(),
      contact: contact.trim(),
      delivery_date: fecha || null,
      status: 'pending',
    });
    setSubmitting(false);
    setShowConfirm(false);
    setShowSuccess(true);
  };

  if (pageLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#fdf6ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px', border: '4px solid #e8d5c0',
            borderTopColor: '#8b2635', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: '#7a5c4e', fontFamily: 'Georgia, serif' }}>Cargando...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!reservationsEnabled) {
    return (
      <div style={{ minHeight: '100vh', background: '#fdf6ec', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{
          maxWidth: '400px', width: '100%', textAlign: 'center',
          background: '#fffaf3', border: '1px solid #e8d5c0',
          borderRadius: '16px', padding: '48px 32px',
        }}>
          <Lock size={40} style={{ color: '#c4a882', margin: '0 auto 16px', display: 'block' }} />
          <h2 style={{ fontFamily: 'Georgia, serif', color: '#2c1810', marginBottom: '12px', fontSize: '20px' }}>
            Reservas no disponibles
          </h2>
          <p style={{ color: '#7a5c4e', fontSize: '15px', lineHeight: '1.6' }}>
            Las reservas no están disponibles en este momento.
          </p>
        </div>
      </div>
    );
  }

  if (notFound || !dish || dish.available === false) {
    return (
      <div style={{ minHeight: '100vh', background: '#fdf6ec', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{
          maxWidth: '400px', width: '100%', textAlign: 'center',
          background: '#fffaf3', border: '1px solid #e8d5c0',
          borderRadius: '16px', padding: '48px 32px',
        }}>
          <UtensilsCrossed size={40} style={{ color: '#c4a882', margin: '0 auto 16px', display: 'block' }} />
          <h2 style={{ fontFamily: 'Georgia, serif', color: '#2c1810', marginBottom: '12px', fontSize: '20px' }}>
            Plato no disponible
          </h2>
          <p style={{ color: '#7a5c4e', fontSize: '15px', lineHeight: '1.6' }}>
            Este plato no se encuentra disponible en este momento.
          </p>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '1.5px solid #e8d5c0', background: '#fff',
    color: '#2c1810', fontSize: '15px', outline: 'none',
    fontFamily: 'Georgia, serif', boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '6px',
    fontSize: '13px', fontWeight: '600', color: '#7a5c4e',
    fontFamily: 'Georgia, serif',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6ec', padding: '32px 16px', fontFamily: 'Georgia, serif' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>

        {/* Dish card */}
        <div style={{
          background: '#fffaf3', border: '1px solid #e8d5c0',
          borderRadius: '16px', padding: '28px 24px', marginBottom: '24px',
        }}>
          {fecha && (
            <p style={{ fontSize: '12px', color: '#7a5c4e', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CalendarDays size={13} style={{ flexShrink: 0 }} />
              {formatDateSpanish(fecha)}
            </p>
          )}
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#2c1810', marginBottom: '8px' }}>
            {dish.name}
          </h1>
          {dish.description && (
            <p style={{ fontSize: '14px', color: '#7a5c4e', lineHeight: '1.6', marginBottom: '12px', fontStyle: 'italic' }}>
              {dish.description}
            </p>
          )}
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#8b2635' }}>
            ${Number(dish.price).toLocaleString('es-CL')} .-
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: '#fffaf3', border: '1px solid #e8d5c0',
          borderRadius: '16px', padding: '28px 24px',
        }}>
          <h2 style={{ fontSize: '17px', fontWeight: 'bold', color: '#2c1810', marginBottom: '20px' }}>
            Datos de tu reserva
          </h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Cantidad</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1.5px solid #e8d5c0', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                style={{
                  width: '52px', height: '48px', border: 'none', background: '#f5e6d3',
                  color: '#8b2635', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRight: '1px solid #e8d5c0', flexShrink: 0,
                }}
              >
                −
              </button>
              <span style={{
                flex: 1, textAlign: 'center', fontSize: '18px', fontWeight: 'bold',
                color: '#2c1810', fontFamily: 'Georgia, serif',
              }}>
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                style={{
                  width: '52px', height: '48px', border: 'none', background: '#8b2635',
                  color: '#fff', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderLeft: '1px solid #e8d5c0', flexShrink: 0,
                }}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Nombre completo</label>
            <input
              type="text" value={customerName} placeholder="Tu nombre"
              onChange={(e) => setCustomerName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Dirección de entrega</label>
            <input
              type="text" value={address} placeholder="Calle, número, ciudad"
              onChange={(e) => setAddress(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Contacto (teléfono o email)</label>
            <input
              type="text" value={contact} placeholder="+56 9 1234 5678"
              onChange={(e) => setContact(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            onClick={handleReserve}
            disabled={!customerName.trim() || !address.trim() || !contact.trim()}
            style={{
              width: '100%', padding: '13px', borderRadius: '12px',
              background: (!customerName.trim() || !address.trim() || !contact.trim()) ? '#e8d5c0' : '#8b2635',
              color: (!customerName.trim() || !address.trim() || !contact.trim()) ? '#7a5c4e' : '#fff',
              fontSize: '16px', fontWeight: 'bold', border: 'none',
              cursor: (!customerName.trim() || !address.trim() || !contact.trim()) ? 'not-allowed' : 'pointer',
              fontFamily: 'Georgia, serif', transition: 'opacity 0.2s',
            }}
          >
            Reservar
          </button>
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, padding: '16px',
        }}>
          <div style={{
            background: '#fffaf3', border: '1px solid #e8d5c0',
            borderRadius: '16px', maxWidth: '420px', width: '100%',
            padding: '32px 28px', fontFamily: 'Georgia, serif',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c1810', marginBottom: '16px' }}>
              Confirmar reserva
            </h3>
            <p style={{ fontSize: '14px', color: '#7a5c4e', lineHeight: '1.7', marginBottom: '24px' }}>
              Estás reservando{' '}
              <strong style={{ color: '#2c1810' }}>{quantity} x {dish.name}</strong>
              {', para el '}
              <strong style={{ color: '#2c1810' }}>
                {fecha ? formatDateSpanish(fecha) : 'fecha por confirmar'}
              </strong>
              {' en '}
              <strong style={{ color: '#2c1810' }}>{address}</strong>
              {'. ¿Estás seguro de continuar?'}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  flex: 1, padding: '11px', borderRadius: '10px',
                  background: '#e8d5c0', color: '#2c1810', border: 'none',
                  fontSize: '14px', cursor: 'pointer', fontFamily: 'Georgia, serif',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                style={{
                  flex: 1, padding: '11px', borderRadius: '10px',
                  background: '#8b2635', color: '#fff', border: 'none',
                  fontSize: '14px', fontWeight: 'bold', cursor: submitting ? 'wait' : 'pointer',
                  fontFamily: 'Georgia, serif',
                }}
              >
                {submitting ? 'Enviando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success modal */}
      {showSuccess && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, padding: '16px',
        }}>
          <div style={{
            background: '#fffaf3', border: '1px solid #e8d5c0',
            borderRadius: '16px', maxWidth: '380px', width: '100%',
            padding: '40px 28px', textAlign: 'center', fontFamily: 'Georgia, serif',
          }}>
            <CheckCircle size={48} style={{ color: '#16a34a', margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2c1810', marginBottom: '12px' }}>
              ¡Listo!
            </h3>
            <p style={{ fontSize: '15px', color: '#7a5c4e', lineHeight: '1.6', marginBottom: '28px' }}>
              Tu reserva fue registrada exitosamente.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              style={{
                padding: '11px 32px', borderRadius: '10px',
                background: '#8b2635', color: '#fff', border: 'none',
                fontSize: '15px', fontWeight: 'bold', cursor: 'pointer',
                fontFamily: 'Georgia, serif',
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
