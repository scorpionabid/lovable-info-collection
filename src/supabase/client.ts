
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CONFIG } from './config';
import { Database } from './types';

// Create Supabase client
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_CONFIG
);

export default supabase;
