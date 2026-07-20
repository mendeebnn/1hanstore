/**
 * Data boundary for the forthcoming Supabase integration.
 * Replace the in-memory product catalogue with these repository methods after
 * supplying VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 */
export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'cancelled';

export interface ProductRecord {
  id: string;
  name: string;
  price: number;
  inventory: number;
  category: string;
  is_active: boolean;
}

export interface OrderRecord {
  id: string;
  status: OrderStatus;
  subtotal: number;
  customer_phone: string;
  delivery_address: string;
  created_at: string;
}

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
};

export const isSupabaseConfigured = Boolean(supabaseConfig.url && supabaseConfig.anonKey);
