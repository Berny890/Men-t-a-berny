import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Trash2, ClipboardList } from 'lucide-react';
import { useReservations, Reservation, ReservationStatus } from '../hooks/useReservations';

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
  return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }).toLowerCase();
};

interface Order {
  orderId: string;
  items: Reservation[];
  customerName: string;
  address: string;
  contact: string;
  deliveryDate: string | null;
  status: ReservationStatus;
  createdAt: string;
}

interface ReservationsManagerProps {
  token: string | null;
}

export const ReservationsManager = ({ token }: ReservationsManagerProps) => {
  const { reservations, loading, load, updateStatus, deleteReservation } = useReservations(token);
  const [filter, setFilter] = useState<ReservationStatus | 'all'>('all');

  useEffect(() => { load(); }, [load]);

  const orders: Order[] = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    reservations.forEach((r) => {
      const group = map.get(r.orderId) || [];
      group.push(r);
      map.set(r.orderId, group);
    });
    return Array.from(map.values())
      .map((items) => ({
        orderId: items[0].orderId,
        items,
        customerName: items[0].customerName,
        address: items[0].address,
        contact: items[0].contact,
        deliveryDate: items[0].deliveryDate,
        status: items[0].status,
        createdAt: items[0].createdAt,
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [reservations]);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const handleDelete = async (order: Order) => {
    if (!confirm('¿Eliminar este pedido?')) return;
    await deleteReservation(order.items.map((i) => i.id));
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

        <div style={{ padding: '10px 24px', background: '#fdf6ec', borderBottom: '1px solid #e8d5c0' }}>
          <p style={{ fontSize: '11.5px', color: '#7a5c4e', margin: 0 }}>
            Los datos de los clientes se eliminan automáticamente a los 30 días de recibido el pedido.
          </p>
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
            Todos ({orders.length})
          </button>
          {ALL_STATUSES.map((s) => {
            const count = orders.filter((o) => o.status === s).length;
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
              <ClipboardList size={36} style={{ color: '#c4a882', margin: '0 auto 12px', display: 'block' }} />
              <p style={{ color: '#7a5c4e', fontSize: '15px', margin: 0 }}>
                {filter === 'all' ? 'Aún no hay reservas registradas.' : 'No hay reservas con este estado.'}
              </p>
            </div>
          )}

          {!loading && filtered.map((order) => {
            const sc = STATUS_COLORS[order.status];
            const orderTotal = order.items.reduce((sum, i) => sum + i.quantity, 0);
            return (
              <div key={order.orderId} style={{
                background: '#fdf6ec', border: '1.5px solid #e8d5c0',
                borderRadius: '12px', padding: '16px', marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  <div>
                    <p style={{ color: '#7a5c4e', fontSize: '13px', margin: '0 0 4px', fontWeight: 'bold' }}>
                      {order.customerName}
                    </p>
                    <div>
                      {order.items.map((item) => (
                        <p key={item.id} style={{ fontWeight: 'bold', color: '#2c1810', fontSize: '14px', margin: '0 0 1px' }}>
                          {item.quantity}x {item.dishName}
                        </p>
                      ))}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px',
                    background: sc.bg, color: sc.color,
                    fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap',
                  }}>
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', marginBottom: '12px' }}>
                  <p style={{ color: '#7a5c4e', fontSize: '12px', margin: 0 }}>
                    <span style={{ fontWeight: 'bold' }}>Dirección:</span> {order.address}
                  </p>
                  <p style={{ color: '#7a5c4e', fontSize: '12px', margin: 0 }}>
                    <span style={{ fontWeight: 'bold' }}>Contacto:</span> {order.contact}
                  </p>
                  <p style={{ color: '#7a5c4e', fontSize: '12px', margin: 0 }}>
                    <span style={{ fontWeight: 'bold' }}>Entrega:</span> {formatDate(order.deliveryDate)}
                  </p>
                  <p style={{ color: '#7a5c4e', fontSize: '12px', margin: 0 }}>
                    <span style={{ fontWeight: 'bold' }}>Recibido:</span>{' '}
                    {new Date(order.createdAt).toLocaleDateString('es-CL')}
                  </p>
                  <p style={{ color: '#7a5c4e', fontSize: '12px', margin: 0 }}>
                    <span style={{ fontWeight: 'bold' }}>Platos en total:</span> {orderTotal}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.items.map((i) => i.id), e.target.value as ReservationStatus)}
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
                    onClick={() => handleDelete(order)}
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
