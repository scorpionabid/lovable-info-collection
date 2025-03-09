
import supabaseUserService, { User, UserFilters } from '../supabase/user';

const userService = {
  getUsers: (filters?: UserFilters) => supabaseUserService.getUsers(filters),
  getUserById: (id: string) => supabaseUserService.getUserById(id),
  createUser: (userData: User) => supabaseUserService.createUser(userData),
  updateUser: (id: string, userData: Partial<User>) => supabaseUserService.updateUser(id, userData),
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

export type { User, UserFilters };
export default userService;
