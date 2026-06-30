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

export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });
    setReservations((data || []).map(fromRow));
    setLoading(false);
  }, []);

  const updateStatus = async (ids: string[], status: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((r) => (ids.includes(r.id) ? { ...r, status } : r))
    );
    await supabase.from('reservations').update({ status }).in('id', ids);
  };

  const deleteReservation = async (ids: string[]) => {
    setReservations((prev) => prev.filter((r) => !ids.includes(r.id)));
    await supabase.from('reservations').delete().in('id', ids);
  };

  return { reservations, loading, load, updateStatus, deleteReservation };
};
