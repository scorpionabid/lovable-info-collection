
import { Json } from '@/integrations/supabase/types';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Json;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string; // Changed from optional to required to match API User
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active: boolean; // Changed from optional to required
  last_login?: string;
  created_at?: string;
  updated_at?: string;
  roles?: Role;
  role?: string; // Added for backward compatibility
}

export type UserStatus = 'active' | 'inactive' | 'all' | string;

export interface CreateUserDto {
  email: string;
  password?: string;
  first_name: string;
  last_name: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active?: boolean;
}

export interface UpdateUserDto {
  email?: string;
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

export interface UserFilters {
  role?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  status?: UserStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  roleDistribution: { role: string; count: number }[];
}

export interface PasswordResetRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
