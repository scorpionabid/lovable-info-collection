
import { Tables } from '../shared';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  roles?: Role | string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  avatar_url?: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[] | any;
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

export type UserStatus = 'active' | 'inactive' | 'all';

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
  password?: string;
  id?: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

export interface UserRoleClaims {
  role: string;
  permissions: string[];
}
