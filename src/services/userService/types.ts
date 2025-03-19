
// User interface for the userService
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  is_active: boolean;
  phone?: string;
  last_login?: string;
  created_at: string;
  updated_at?: string;
  utis_code?: string;
}

// UserFilter interface for filtering users
export interface UserFilter {
  search?: string;
  roleId?: string;
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  isActive?: boolean;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// EntityOption for dropdowns
export interface EntityOption {
  id: string;
  name: string;
}

// User response
export interface UserResponse {
  data: User[] | null;
  count: number;
  error: any;
}

// DTO for creating a new user
export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roleId: string;
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  phone?: string;
  utisCode?: string;
}

// DTO for updating an existing user
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
