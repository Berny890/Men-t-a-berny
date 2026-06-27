import { useEffect, useState } from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
import { useReservations, ReservationStatus } from '../hooks/useReservations';

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: 'Pedido',
  purchased: 'Productos comprados',
  preparing: 'Preparado',
  delivering: 'En reparto',
  received: 'Recibido',
};

const STATUS_COLORS: Record<ReservationStatus, { bg: string; color: string }> = {
  pending: { bg: '#e5e7eb', color: '#374151' },
  purchased: { bg: '#dbeafe', color: '#1e40af' },
  preparing: { bg: '#fef9c3', color: '#854d0e' },
  delivering: { bg: '#ffedd5', color: '#9a3412' },
  received: { bg: '#dcfce7', color: '#166534' },
};

const ALL_STATUSES: ReservationStatus[] = ['pending', 'purchased', 'preparing', 'delivering', 'received'];

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return 'Por confirmar';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' });
};

export const ReservationsManager = () => {
  const { reservations, loading, load, updateStatus, deleteReservation } = useReservations();
  const [filter, setFilter] = useState<ReservationStatus | 'all'>('all');

  useEffect(() => { load(); }, [load]);

  const filtered = filter === 'all' ? reservations : reservations.filter((r) => r.status === filter);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta reserva?')) return;
    await deleteReservation(id);
  };

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <div style={{
        background: '#fffaf3', border: '1px solid #e8d5c0',
        borderRadius: '16px', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: '#f5e6d3', borderBottom: '1px solid #e8d5c0',
          padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2c1810', margin: 0 }}>
            Reservas recibidas
          </h2>
          <button
            onClick={load}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '10px',
              background: '#8b2635', color: '#fff', border: 'none',
              fontSize: '13px', cursor: 'pointer', fontFamily: 'Georgia, serif',
            }}
          >
            <RefreshCw size={14} style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }} />
            Actualizar
          </button>
        </div>

        {/* Filtro */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e8d5c0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '5px 14px', borderRadius: '20px', border: 'none',
              background: filter === 'all' ? '#8b2635' : '#e8d5c0',
              color: filter === 'all' ? '#fff' : '#2c1810',
              fontSize: '12px', cursor: 'pointer', fontFamily: 'Georgia, serif',
            }}
          >
            Todos ({reservations.length})
          </button>
          {ALL_STATUSES.map((s) => {
            const count = reservations.filter((r) => r.status === s).length;
            const active = filter === s;
            const { bg, color } = STATUS_COLORS[s];
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                style={{
                  padding: '5px 14px', borderRadius: '20px', border: 'none',
                  background: active ? '#8b2635' : bg,
                  color: active ? '#fff' : color,
                  fontSize: '12px', cursor: 'pointer', fontFamily: 'Georgia, serif',
                  fontWeight: active ? 'bold' : 'normal',
                }}
              >
                {STATUS_LABELS[s]} ({count})
              </button>
            );
          })}
        </div>

        {/* Lista */}
        <div style={{ padding: '16px 24px' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#7a5c4e' }}>
              Cargando...
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '48px 24px',
              border: '1.5px dashed #e8d5c0', borderRadius: '12px',
            }}>
              <p style={{ fontSize: '28px', marginBottom: '12px' }}>📋</p>
              <p style={{ color: '#7a5c4e', fontSize: '15px' }}>
                {filter === 'all' ? 'Aún no hay reservas registradas.' : 'No hay reservas con este estado.'}
              </p>
            </div>
          )}

          {!loading && filtered.map((r) => {
            const sc = STATUS_COLORS[r.status];
            return (
              <div key={r.id} style={{
                background: '#fdf6ec', border: '1.5px solid #e8d5c0',
                borderRadius: '12px', padding: '16px', marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', color: '#2c1810', fontSize: '15px', margin: '0 0 2px' }}>
                      {r.quantity}x {r.dishName}
                    </p>
                    <p style={{ color: '#7a5c4e', fontSize: '13px', margin: 0 }}>
                      {r.customerName}
                    </p>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px',
                    background: sc.bg, color: sc.color,
                    fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap',
                  }}>
                    {STATUS_LABELS[r.status]}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', marginBottom: '12px' }}>
                  <p style={{ color: '#7a5c4e', fontSize: '12px', margin: 0 }}>
                    <span style={{ fontWeight: 'bold' }}>Dirección:</span> {r.address}
                  </p>
                  <p style={{ color: '#7a5c4e', fontSize: '12px', margin: 0 }}>
                    <span style={{ fontWeight: 'bold' }}>Contacto:</span> {r.contact}
                  </p>
                  <p style={{ color: '#7a5c4e', fontSize: '12px', margin: 0 }}>
                    <span style={{ fontWeight: 'bold' }}>Entrega:</span> {formatDate(r.deliveryDate)}
                  </p>
                  <p style={{ color: '#7a5c4e', fontSize: '12px', margin: 0 }}>
                    <span style={{ fontWeight: 'bold' }}>Recibido:</span>{' '}
                    {new Date(r.createdAt).toLocaleDateString('es-CL')}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value as ReservationStatus)}
                    style={{
                      flex: 1, padding: '7px 10px', borderRadius: '8px',
                      border: '1.5px solid #e8d5c0', background: '#fff',
                      color: '#2c1810', fontSize: '13px', fontFamily: 'Georgia, serif',
                    }}
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(r.id)}
                    style={{
                      padding: '7px 10px', borderRadius: '8px',
                      background: '#fde8e8', color: '#8b2635', border: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center',
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
