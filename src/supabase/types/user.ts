
import { Tables } from '@/integrations/supabase/types';

// Base User type
export type User = Tables<'users'> & {
  role?: string;
  roles?: {
    id: string;
    name: string;
    permissions: string[];
  };
  region?: string;
  sector?: string;
  school?: string;
};

export interface UserWithRole extends User {
  roleName: string;
  permissions: string[];
}

// Filter for users
export interface UserFilters {
  search?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  status?: 'active' | 'inactive' | 'blocked' | 'all';
  page?: number;
  page_size?: number;
  sort_field?: string;
  sort_direction?: 'asc' | 'desc';
}

// Create DTO
export interface CreateUserDto {
  email: string;
  first_name: string;
  last_name: string;
  password?: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active?: boolean;
}

// Update DTO
export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active?: boolean;
}
