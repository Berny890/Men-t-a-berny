import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type ReservationStatus = 'pending' | 'purchased' | 'preparing' | 'delivering' | 'received';

export interface Reservation {
  id: string;
  orderId: string;
  dishId: string;
  dishName: string;
  quantity: number;
  customerName: string;
  address: string;
  contact: string;
  deliveryDate: string | null;
  status: ReservationStatus;
  createdAt: string;
}

const fromRow = (row: Record<string, unknown>): Reservation => ({
  id: row.id as string,
  orderId: (row.order_id as string) || (row.id as string),
  dishId: row.dish_id as string,
  dishName: row.dish_name as string,
  quantity: row.quantity as number,
  customerName: row.customer_name as string,
  address: row.address as string,
  contact: row.contact as string,
  deliveryDate: (row.delivery_date as string) || null,
  status: (row.status as ReservationStatus) || 'pending',
  createdAt: row.created_at as string,
});

export const useReservations = (token: string | null) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    await supabase.rpc('cleanup_old_reservations');
    const { data } = await supabase.rpc('get_reservations', { session_token: token });
    setReservations((data || []).map(fromRow));
    setLoading(false);
  }, [token]);

  const updateStatus = async (ids: string[], status: ReservationStatus) => {
    if (!token) return;
    setReservations((prev) =>
      prev.map((r) => (ids.includes(r.id) ? { ...r, status } : r))
    );
    await supabase.rpc('update_reservation_status', { session_token: token, ids, new_status: status });
  };

  const deleteReservation = async (ids: string[]) => {
    if (!token) return;
    setReservations((prev) => prev.filter((r) => !ids.includes(r.id)));
    await supabase.rpc('delete_reservations', { session_token: token, ids });
  };

  return { reservations, loading, load, updateStatus, deleteReservation };
};
