
// Bridge file to redirect to the centralized Supabase client
// This file exists to maintain compatibility with existing imports
import { supabase } from '@/integrations/supabase/client';

// Re-export the supabase client
export { supabase };

// Export supabaseAdmin as an alias to the regular supabase client
// This is needed for backward compatibility with code that uses supabaseAdmin
export const supabaseAdmin = supabase;

// If there were any other exports from the original supabaseClient.ts,
// they would need to be recreated or imported here
export type DataEntry = any;
export type DataHistory = any;
export type Region = any;
export type Notification = any;
export type Category = any;
export type Sector = any;
export type User = any;
export type Json = any;
