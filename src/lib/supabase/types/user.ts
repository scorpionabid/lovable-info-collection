
import { Tables } from '@/types/supabase';

// Base User type from the database
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  utis_code?: string;
  is_active: boolean;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  role?: string;
  userRole?: string;
  
  // Backward compatibility fields to support `roles` property
  // These should be used as User.role, but some components use User.roles
  roles?: string;
  
  // Organization entities names
  region?: string;
  sector?: string;
  school?: string;
}

// User with role information
export interface UserWithRole extends User {
  role: string;
}

// User filters for API requests
export interface UserFilters {
  search?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  status?: 'active' | 'inactive' | 'all' | 'blocked';
  page?: number;
  pageSize?: number;
}

// Create user DTO
export interface CreateUserDto {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  utis_code?: string;
  is_active?: boolean;
}

// Update user DTO
export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  utis_code?: string;
  is_active?: boolean;
  avatar_url?: string;
}
