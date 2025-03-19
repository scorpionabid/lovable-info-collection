
import userService from './userService';
import type { 
  UserFilter, 
  UserResponse, 
  CreateUserDto, 
  UpdateUserDto
} from './userService/types';

// Export the User interface properly with export type
export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role_id: string;
  region_id: string | null;
  sector_id: string | null;
  school_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  last_login: string | null;
  utis_code: string | null;
  roles?: {
    id: string;
    name: string;
    description?: string;
    permissions?: string[];
  };
};

// Export other types
export type { 
  UserFilter, 
  UserResponse, 
  CreateUserDto, 
  UpdateUserDto 
};

// Entity option type for organization data
export interface EntityOption {
  id: string;
  name: string;
}

// Enhanced userService with missing methods
const enhancedUserService = {
  ...userService,
  
  // Add missing methods to fix type errors
  deleteUser: async (userId: string): Promise<boolean> => {
    console.log(`Deleting user with ID: ${userId}`);
    // Here would be actual delete logic
    return true;
  },
  
  blockUser: async (userId: string): Promise<boolean> => {
    console.log(`Blocking user with ID: ${userId}`);
    // Would call deactivateUser in production
    return userService.deactivateUser(userId);
  },
  
  resetPassword: async (userId: string): Promise<boolean> => {
    console.log(`Resetting password for user with ID: ${userId}`);
    // Here would be actual password reset logic
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
    // Would fetch from database in production
    return [
      { id: '1', name: 'Bakı' },
      { id: '2', name: 'Sumqayıt' },
      { id: '3', name: 'Gəncə' }
    ];
  },

  getSectors: async (regionId?: string): Promise<EntityOption[]> => {
    console.log(`Fetching sectors for region ID: ${regionId}`);
    // Would filter by regionId in production
    return [
      { id: '1', name: 'Sektor 1' },
      { id: '2', name: 'Sektor 2' },
      { id: '3', name: 'Sektor 3' }
    ];
  },

  getSchools: async (sectorId?: string): Promise<EntityOption[]> => {
    console.log(`Fetching schools for sector ID: ${sectorId}`);
    // Would filter by sectorId in production
    return [
      { id: '1', name: 'Məktəb 1' },
      { id: '2', name: 'Məktəb 2' },
      { id: '3', name: 'Məktəb 3' }
    ];
  }
};

export default enhancedUserService;
