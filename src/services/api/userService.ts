
import supabaseUserService, { User, UserFilters } from '../supabase/userService';

const userService = {
  getUsers: (filters?: UserFilters) => supabaseUserService.getUsers(filters),
  getUserById: (id: string) => supabaseUserService.getUserById(id),
  createUser: (userData: Omit<User, 'id'>) => supabaseUserService.createUser(userData),
  updateUser: (id: string, userData: Partial<User>) => supabaseUserService.updateUser(id, userData),
  deleteUser: (id: string) => supabaseUserService.deleteUser(id),
  blockUser: (id: string) => supabaseUserService.blockUser(id),
  activateUser: (id: string) => supabaseUserService.activateUser(id),
  resetPassword: (id: string) => supabaseUserService.resetPassword(id),
  
  // Entity information
  getRegions: () => supabaseUserService.getRegions(),
  getSectors: (regionId?: string) => supabaseUserService.getSectors(regionId),
  getSchools: (sectorId?: string) => supabaseUserService.getSchools(sectorId),
  getRoles: () => supabaseUserService.getRoles(),
};

export type { User, UserFilters };
export default userService;
