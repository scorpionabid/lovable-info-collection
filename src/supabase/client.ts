
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';
import type { Database } from '@/lib/supabase/types/database';

// Supabase müştərisini yaradırıq
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_ANON_KEY
);

// Xəta emalını idarə etmək üçün utility funksiya
export const handleSupabaseError = (error: any, context: string = 'Supabase əməliyyatı'): Error => {
  const formattedError = new Error(
    error?.message || error?.error_description || 'Naməlum Supabase xətası'
  );
  
  console.error(`${context} xətası:`, error);
  return formattedError;
};

export default supabase;
