
import { supabase } from '@/lib/supabase';
import { User as SupabaseUser } from "@/services/supabase/user/types";
import supabaseUserService from "@/services/supabase/user";
import { User, UserFilter, UserResponse, CreateUserDto, UpdateUserDto } from "./userService/types";

// Create a bridge between the old userService and the new Supabase implementation
const userService = {
  getUsers: async (filters: UserFilter = {}): Promise<UserResponse> => {
    try {
      // Map userService filter format to supabase user service format
      const supabaseFilters: any = {
        search: filters.search,
        role_id: filters.roleId,
        region_id: filters.regionId,
        sector_id: filters.sectorId,
        school_id: filters.schoolId,
        status: filters.isActive === undefined ? 'all' : filters.isActive ? 'active' : 'inactive',
        sort_field: filters.sortField,
        sort_order: filters.sortOrder
      };

      // Get users from Supabase
      const users = await supabaseUserService.getUsers(supabaseFilters);
      
      // Return in the expected format
      return { 
        data: users as unknown as User[], 
        count: users?.length || 0, 
        error: null 
      };
    } catch (error) {
      console.error("Error in getUsers bridge:", error);
      return { data: null, count: 0, error };
    }
  },

  getUserById: async (id: string): Promise<User | null> => {
    try {
      const user = await supabaseUserService.getUserById(id);
      return user as unknown as User;
    } catch (error) {
      console.error("Error in getUserById bridge:", error);
      return null;
    }
  },

  createUser: async (user: CreateUserDto): Promise<User | null> => {
    try {
      // Map from the old format to the new format
      const supabaseUser: Partial<SupabaseUser> = {
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        role_id: user.roleId,
        region_id: user.regionId,
        sector_id: user.sectorId,
        school_id: user.schoolId,
        phone: user.phone,
        utis_code: user.utisCode,
        is_active: true
      };
      
      const createdUser = await supabaseUserService.createUser({
        ...supabaseUser as any,
        password: user.password
      });
      
      return createdUser as unknown as User;
    } catch (error) {
      console.error("Error in createUser bridge:", error);
      return null;
    }
  },

  updateUser: async (id: string, user: UpdateUserDto): Promise<User | null> => {
    try {
      // Map from the old format to the new format
      const supabaseUser: Partial<SupabaseUser> = {
        first_name: user.firstName,
        last_name: user.lastName,
        role_id: user.roleId,
        region_id: user.regionId,
        sector_id: user.sectorId,
        school_id: user.schoolId,
        phone: user.phone,
        utis_code: user.utisCode,
        is_active: user.isActive
      };
      
      const updatedUser = await supabaseUserService.updateUser(id, supabaseUser);
      return updatedUser as unknown as User;
    } catch (error) {
      console.error("Error in updateUser bridge:", error);
      return null;
    }
  },

  deleteUser: async (id: string): Promise<boolean> => {
    try {
      return await supabaseUserService.deleteUser(id);
    } catch (error) {
      console.error("Error in deleteUser bridge:", error);
      return false;
    }
  },

  blockUser: async (id: string): Promise<boolean> => {
    try {
      // Call to block user using the Supabase service
      const result = await supabaseUserService.blockUser(id);
      return result ? true : false;
    } catch (error) {
      console.error("Error in blockUser bridge:", error);
      return false;
    }
  },

  activateUser: async (id: string): Promise<boolean> => {
    try {
      const result = await supabaseUserService.activateUser(id);
      return result ? true : false;
    } catch (error) {
      console.error("Error in activateUser bridge:", error);
      return false;
    }
  },

  resetPassword: async (id: string): Promise<boolean> => {
    try {
      return await supabaseUserService.resetPassword(id);
    } catch (error) {
      console.error("Error in resetPassword bridge:", error);
      return false;
    }
  },

  resetUserPassword: async (id: string): Promise<boolean> => {
    return userService.resetPassword(id);
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (supabaseUserService.updatePassword) {
        return await supabaseUserService.updatePassword(newPassword);
      } else {
        // Fallback to Supabase Auth directly
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        return !error;
      }
    } catch (error) {
      console.error("Error in changePassword bridge:", error);
      return false;
    }
  },

  // Organization data getters
  getRoles: async () => {
    try {
      const roles = await supabaseUserService.getRoles();
      return roles;
    } catch (error) {
      console.error("Error in getRoles bridge:", error);
      return [];
    }
  },

  getRegions: async (userId?: string, userRole?: string) => {
    try {
      const regions = await supabaseUserService.getRegions();
      return regions;
    } catch (error) {
      console.error("Error in getRegions bridge:", error);
      return [];
    }
  },

  getSectors: async (regionId: string, userId?: string, userRole?: string) => {
    try {
      const sectors = await supabaseUserService.getSectors(regionId);
      return sectors;
    } catch (error) {
      console.error("Error in getSectors bridge:", error);
      return [];
    }
  },

  getSchools: async (sectorId: string, userId?: string, userRole?: string) => {
    try {
      const schools = await supabaseUserService.getSchools(sectorId);
      return schools;
    } catch (error) {
      console.error("Error in getSchools bridge:", error);
      return [];
    }
  }
};

export default userService;
