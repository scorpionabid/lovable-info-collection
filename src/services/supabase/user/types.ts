
// Import any required dependencies
import { PostgrestResponse } from '@supabase/supabase-js';

// Define the Role interface
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[] | any; // Allow for JSON type from Supabase
}

// Define the User interface
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  roles?: Role;
  role?: string; // Add backwards compatibility field
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

// Define the UserStatus type
export type UserStatus = 'active' | 'inactive' | 'all';

// User Filters interface
export interface UserFilters {
  role?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  status?: UserStatus;
  search?: string;
}

// CreateUserDto should mirror User but make id optional
export interface CreateUserDto {
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active: boolean;
  password?: string; // Additional field for creation
  id?: string; // Make id optional for creation
}

// Define UpdateUserDto
export interface UpdateUserDto extends Partial<CreateUserDto> {}

// Define any other types needed
export type QueryResult<T> = Promise<PostgrestResponse<T>>;

// Define error structure for multi-user creation
export interface UserCreationError {
  user: CreateUserDto;
  error: any;
}

// Define multi-user creation result
export interface MultiUserCreationResult {
  data: User[] | null;
  error: Error | null;
  errorDetails?: UserCreationError[];
}
