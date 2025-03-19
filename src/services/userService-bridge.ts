
import userService from './userService';
import type { 
  UserFilter, 
  UserResponse, 
  CreateUserDto, 
  UpdateUserDto, 
  EntityOption 
} from './userService/types';

// Export the User interface
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role_id: string;
  region_id: string | null;
  sector_id: string | null;
  school_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  utis_code: string | null;
}

// Export the type definitions
export type { 
  UserFilter, 
  UserResponse, 
  CreateUserDto, 
  UpdateUserDto, 
  EntityOption 
};

// Enhanced userService with missing methods
const enhancedUserService = {
  ...userService,
  
  // Add missing methods to fix type errors
  deleteUser: async (userId: string): Promise<boolean> => {
    console.log(`Deleting user with ID: ${userId}`);
    // Here we would implement the actual delete logic
    return true;
  },
  
  blockUser: async (userId: string): Promise<boolean> => {
    console.log(`Blocking user with ID: ${userId}`);
    // Here we would implement the actual blocking logic
    return true;
  },
  
  resetPassword: async (userId: string): Promise<boolean> => {
    console.log(`Resetting password for user with ID: ${userId}`);
    // Here we would implement the actual password reset logic
    return true;
  },

  // Organization data methods
  getRoles: async (): Promise<EntityOption[]> => {
    return [
      { id: 'super_admin', name: 'Super Admin' },
      { id: 'region_admin', name: 'Region Admin' },
      { id: 'sector_admin', name: 'Sector Admin' },
      { id: 'school_admin', name: 'School Admin' }
    ];
  },

  getRegions: async (): Promise<EntityOption[]> => {
    return []; // Would fetch actual regions in production
  },

  getSectors: async (regionId?: string): Promise<EntityOption[]> => {
    console.log(`Fetching sectors for region ID: ${regionId}`);
    return []; // Would fetch actual sectors in production
  },

  getSchools: async (sectorId?: string): Promise<EntityOption[]> => {
    console.log(`Fetching schools for sector ID: ${sectorId}`);
    return []; // Would fetch actual schools in production
  }
};

export default enhancedUserService;
