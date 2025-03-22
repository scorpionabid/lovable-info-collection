
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CONFIG } from '@/lib/supabase/config';

// Create regular Supabase client for most operations
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_CONFIG);

// A special admin client for operations that might need to bypass RLS
// In a real production app, this would use a service role key with higher privileges
// For this demo, we're using the same client for both
export const supabaseAdmin = supabase;

// Export for use in other files
export default supabase;
