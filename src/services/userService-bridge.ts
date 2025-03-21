
import userServiceInternal from './supabase/user';
import { User as SupabaseUser, UserFilters } from './supabase/user/types';
import type { User as UserServiceUser, UserFilter, UserResponse, CreateUserDto, UpdateUserDto } from './userService/types';

// Export the User interface from userService
export interface User extends SupabaseUser {
  roleName?: string;
  role?: string;
  created_at: string;
}

// Export other types from types.ts
export * from './userService/types';

// Create a bridge between the internal and external user services
const userService = {
  // User management
  getUsers: async (filters?: UserFilter): Promise<UserResponse> => {
    try {
      const supabaseFilters: UserFilters = {
        search: filters?.search,
        role_id: filters?.roleId,
        region_id: filters?.regionId,
        sector_id: filters?.sectorId,
        school_id: filters?.schoolId,
        status: filters?.isActive === true ? 'active' : filters?.isActive === false ? 'inactive' : 'all'
      };
      
      const users = await userServiceInternal.getUsers(supabaseFilters);
      return { data: users as unknown as User[], count: users.length, error: null };
    } catch (error) {
      console.error('Error in getUsers bridge:', error);
      return { data: null, count: 0, error };
    }
  },
  
  getUserById: async (id: string): Promise<User> => {
    return userServiceInternal.getUserById(id) as unknown as Promise<User>;
  },
  
  createUser: async (userData: CreateUserDto): Promise<User> => {
    const supabaseUser = {
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      role_id: userData.roleId,
      region_id: userData.regionId,
      sector_id: userData.sectorId,
      school_id: userData.schoolId,
      phone: userData.phone,
      utis_code: userData.utisCode,
      is_active: true,
      ...(userData.password ? { password: userData.password } : {})
    };
    
    return userServiceInternal.createUser(supabaseUser) as unknown as Promise<User>;
  },
  
  updateUser: async (id: string, userData: UpdateUserDto): Promise<User> => {
    const supabaseUser = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      role_id: userData.roleId,
      region_id: userData.regionId,
      sector_id: userData.sectorId,
      school_id: userData.schoolId,
      phone: userData.phone,
      utis_code: userData.utisCode,
      is_active: userData.isActive
    };
    
    return userServiceInternal.updateUser(id, supabaseUser) as unknown as Promise<User>;
  },
  
  deleteUser: async (id: string): Promise<boolean> => {
    return userServiceInternal.deleteUser(id);
  },
  
  blockUser: async (id: string): Promise<User> => {
    return userServiceInternal.blockUser(id) as unknown as Promise<User>;
  },
  
  activateUser: async (id: string): Promise<User> => {
    return userServiceInternal.activateUser(id) as unknown as Promise<User>;
  },
  
  resetPassword: async (id: string): Promise<boolean> => {
    return userServiceInternal.resetPassword(id);
  },
  
  resetUserPassword: async (id: string, newPassword: string): Promise<boolean> => {
    console.log(`Resetting password for user ${id}`);
    return userServiceInternal.resetPassword(id);
  },
  
  changePassword: async (oldPassword: string, newPassword: string): Promise<boolean> => {
    console.log('Changing password');
    return true;
  },
  
  // Organization data methods
  getRoles: async (currentUserId?: string, currentUserRole?: string) => {
    return userServiceInternal.getRoles(currentUserId, currentUserRole);
  },

  getRegions: async (currentUserId?: string, currentUserRole?: string) => {
    return userServiceInternal.getRegions(currentUserId, currentUserRole);
  },

  getSectors: async (regionId?: string, currentUserId?: string, currentUserRole?: string) => {
    return userServiceInternal.getSectors(regionId, currentUserId, currentUserRole);
  },

  getSchools: async (sectorId?: string, currentUserId?: string, currentUserRole?: string) => {
    return userServiceInternal.getSchools(sectorId, currentUserId, currentUserRole);
  }
};

export default userService;
