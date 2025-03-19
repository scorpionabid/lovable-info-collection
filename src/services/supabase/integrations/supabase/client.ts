
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseKey } from '@/services/supabase/client/config';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Export for use in other files
export default supabase;
