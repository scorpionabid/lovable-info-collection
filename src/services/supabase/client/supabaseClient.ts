
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CONFIG } from '@/supabase/config';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CONFIG);

// Export for use in other files
export default supabase;
