
// Define the User interface to be consistent across the application
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  role?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  phone?: string;
  utis_code?: string;
  is_active: boolean;
  last_login?: string;
  permissions?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface UserFilter {
  search?: string;
  roleId?: string;
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserResponse {
  data: User[] | null;
  count: number;
  error: any | null;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: string;
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  phone?: string;
  utisCode?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  roleId?: string;
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  phone?: string;
  utisCode?: string;
  isActive?: boolean;
}

export interface EntityOption {
  id: string;
  name: string;
}
