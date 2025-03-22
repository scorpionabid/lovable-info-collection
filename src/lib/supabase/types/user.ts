
import { Tables } from "./shared";

// Role interface
export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: string[] | any;
}

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
  
  // For backward compatibility (either role or roles can be used)
  role?: string | Role;
  roles?: string | Role;
  
  // Organizational relationship names
  region?: string;
  sector?: string;
  school?: string;
  
  // Permissions for authenticated users
  permissions?: string[];
}

// User with role information
export interface UserWithRole extends User {
  role: string | Role;
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

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// User role enum for TypeScript
export enum UserRole {
  SuperAdmin = 'super-admin',
  RegionAdmin = 'region-admin',
  SectorAdmin = 'sector-admin',
  SchoolAdmin = 'school-admin',
  Unknown = 'unknown'
}
