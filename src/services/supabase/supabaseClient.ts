
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Define the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || '';

// Create a standard client (with anonymous access)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Create an admin client (with service role for bypassing RLS)
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey);

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
  body: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  notification_type: string;
  action_url?: string;
  data?: any;
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
