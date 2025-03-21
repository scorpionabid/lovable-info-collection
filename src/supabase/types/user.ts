
import { Tables } from '@/integrations/supabase/types';

// Base User type from database
export type User = Tables<'users'> & {
  role?: string;
  roleName?: string;
};

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
