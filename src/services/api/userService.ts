
import supabaseUserService from '../supabase/user';

export interface UserFilters {
  search?: string;
  roleId?: string;
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  status?: 'active' | 'inactive';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  // For backward compatibility
  role?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
}

export interface User {
  id: string;
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
  created_at?: string;
  updated_at?: string;
  last_login?: string;
  roles?: {
    id: string;
    name: string;
    description: string; // Made required to match Supabase Role type
    permissions: any; // Changed to 'any' to be compatible with both Json and string[]
  };
  // For backward compatibility
  role?: string;
}

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
  is_active: boolean; // Changed from optional to required
  password?: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

const userService = {
  getUsers: (filters?: UserFilters) => supabaseUserService.getUsers(filters),
  getUserById: (id: string) => supabaseUserService.getUserById(id),
  createUser: (userData: CreateUserDto) => supabaseUserService.createUser(userData as any),
  updateUser: (id: string, userData: UpdateUserDto) => supabaseUserService.updateUser(id, userData as any),
  deleteUser: (id: string) => supabaseUserService.deleteUser(id),
  blockUser: (id: string) => supabaseUserService.blockUser(id),
  activateUser: (id: string) => supabaseUserService.activateUser(id),
  resetPassword: (id: string) => supabaseUserService.resetPassword(id),
  checkUtisCodeExists: (utisCode: string, userId?: string) => supabaseUserService.checkUtisCodeExists(utisCode, userId),
  
  // Entity information
  getRegions: (userId?: string, userRole?: string) => supabaseUserService.getRegions(userId, userRole),
  getSectors: (regionId?: string, userId?: string, userRole?: string) => supabaseUserService.getSectors(regionId, userId, userRole),
  getSchools: (sectorId?: string, userId?: string, userRole?: string) => supabaseUserService.getSchools(sectorId, userId, userRole),
  getRoles: () => supabaseUserService.getRoles(),
};

export default userService;
