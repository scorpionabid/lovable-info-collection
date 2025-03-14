
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Define the Supabase URLs and keys directly
const supabaseUrl = "https://wxkaasjwpavlwrpvsuia.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4a2Fhc2p3cGF2bHdycHZzdWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODA3NzAsImV4cCI6MjA1NTk1Njc3MH0.Sy0ktssGHAMNtU4kCrEKuFNf8Yf5R280uqwpsMcZpuM";
// Note: Service role key should be kept secure and not exposed in client code
// This is a placeholder - use environment variables in production
const supabaseServiceKey = "";

// Create a standard client (with anonymous access)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Create an admin client (with service role for bypassing RLS)
// Only initialize if service key is available
export const supabaseAdmin = supabaseServiceKey ? 
  createClient<Database>(supabaseUrl, supabaseServiceKey) : 
  supabase;

// Custom type definitions
export interface Region {
  id: string;
  name: string;
  code?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  last_login?: string;
  phone?: string;
  utis_code?: string;
  roles?: {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
  };
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  link?: string;
  notification_type: string;
  action_url?: string;
  data?: any;
  body: string;
}

export interface DataEntry {
  id: string;
  data: any;
  created_at: string;
  updated_at: string;
  category_id?: string;
  school_id?: string;
  status: string;
  created_by?: string;
  submitted_at?: string;
  approved_at?: string;
  approved_by?: string;
}

export interface DataHistory {
  id: string;
  data_id: string;
  data: any;
  status: string;
  changed_at: string;
  changed_by?: string;
}
