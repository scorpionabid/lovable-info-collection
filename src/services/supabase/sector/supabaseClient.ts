
// Bridge file to redirect to the centralized Supabase client
import { supabase } from '@/integrations/supabase/client';

// Re-export the supabase client
export { supabase };

// Mock the supabaseAdmin client if it was used
export const supabaseAdmin = supabase;
