
import { supabase } from '@/lib/supabase/client';

export function useSupabaseClient() {
  return supabase;
}
