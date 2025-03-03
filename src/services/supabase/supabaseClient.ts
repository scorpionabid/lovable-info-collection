
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Anon key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types based on our schema
export type Region = {
  id: string;
  name: string;
  code: string;
  description?: string;
  created_at: string;
  updated_at?: string;
};

export type Sector = {
  id: string;
  name: string;
  code: string;
  region_id: string;
  description?: string;
  created_at: string;
  updated_at?: string;
};

export type SchoolType = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
};

export type School = {
  id: string;
  name: string;
  code: string;
  type_id: string;
  sector_id: string;
  region_id: string;
  address?: string;
  phone?: string;
  email?: string;
  director_name?: string;
  student_count?: number;
  teacher_count?: number;
  description?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
};

export type Role = {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  created_at: string;
};

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at?: string;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  assignment: 'all' | 'regions' | 'sectors' | 'schools';
  deadline?: string;
  status: 'active' | 'inactive';
  priority: number;
  created_at: string;
  updated_at?: string;
};

export type Column = {
  id: string;
  category_id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  is_required: boolean;
  order: number;
  options?: string[]; // For select type columns
  min_value?: number;
  max_value?: number;
  regex_pattern?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
};

export type CalculatedColumn = {
  id: string;
  category_id: string;
  name: string;
  formula: string;
  order: number;
  description?: string;
  created_at: string;
  updated_at?: string;
};

export type DataEntry = {
  id: string;
  category_id: string;
  school_id: string;
  user_id: string;
  data: Record<string, any>; // JSON object with column_id: value
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submitted_at?: string;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at?: string;
};

export type DataHistory = {
  id: string;
  data_id: string;
  user_id: string;
  previous_data: Record<string, any>;
  new_data: Record<string, any>;
  change_reason?: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  link?: string;
  created_at: string;
};

export type AuditLog = {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: Record<string, any>;
  ip_address?: string;
  created_at: string;
};

export type PasswordReset = {
  id: string;
  email: string;
  token: string;
  expires_at: string;
  created_at: string;
};
