
// Database types based on our schema
export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  link?: string;
  created_at: string;
  read_at?: string;
};

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active?: boolean;
  last_login?: string;
  roles?: {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
  };
};

export type DataEntry = {
  id: string;
  category_id: string;
  school_id: string;
  user_id: string;
  data: Record<string, any>;
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
  data: Record<string, any>;
  status: string;
  changed_by: string;
  created_at: string;
};

// Add column type definition for improved type safety
export type Column = {
  id: string;
  category_id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
  options?: string[];
  order: number;
  created_at: string;
  updated_at: string;
};

// Add category type based on the database schema
export type Category = {
  id: string;
  name: string;
  description?: string;
  assignment: 'All' | 'Regions' | 'Sectors' | 'Schools';
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  priority: number;
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
  created_by?: string;
  school_type_id?: string;
};
