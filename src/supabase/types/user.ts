
import { Tables } from '@/integrations/supabase/types';

// Base User type from database
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  utis_code?: string;
  is_active: boolean;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  
  // Virtual fields
  role?: string;
  roleName?: string;
  
  // For compatibility with existing code that uses roles instead of role
  roles?: {
    id?: string;
    name?: string;
  };
  
  // Virtual fields for locations
  region?: {
    id?: string;
    name?: string;
  };
  sector?: {
    id?: string;
    name?: string;
  };
  school?: {
    id?: string;
    name?: string;
  };
}

// User with role information
export interface UserWithRole extends User {
  role: string;
  roleName: string;
}

// User filter interface
export interface UserFilters {
  search?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  status?: 'active' | 'inactive' | 'all';
  page?: number;
  page_size?: number;
}

// Special type for auth.users with role claims
export interface UserRoleClaims extends User {
  app_metadata?: {
    claims?: {
      roles?: string | string[];
    };
  };
}

// Create DTO
export interface CreateUserDto {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  utis_code?: string;
  is_active?: boolean;
  password?: string;
}

// Update DTO
export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  phone?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  utis_code?: string;
  is_active?: boolean;
}
