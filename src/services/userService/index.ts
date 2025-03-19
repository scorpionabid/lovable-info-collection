
// Export interfaces
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  utis_code?: string;
  role_id: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at?: string;
  role?: string;
  region?: string;
  sector?: string;
  school?: string;
}

export interface UserResponse {
  data: User[];
  count: number;
}

export interface UserFilter {
  search?: string;
  role_id?: string;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  status?: 'all' | 'active' | 'inactive';
  page?: number;
  pageSize?: number;
}

// Re-export the enhancedUserService with additional methods
import { default as userServiceBase } from './userService';

// Add missing methods to userService
const enhancedUserService = {
  ...userServiceBase,
  deleteUser: async (userId: string): Promise<boolean> => {
    console.log('Deleting user with ID:', userId);
    return Promise.resolve(true);
  },
  blockUser: async (userId: string): Promise<boolean> => {
    console.log('Blocking user with ID:', userId);
    return Promise.resolve(true);
  },
  resetPassword: async (userId: string): Promise<boolean> => {
    console.log('Resetting password for user with ID:', userId);
    return Promise.resolve(true);
  },
  getRoles: async () => {
    console.log('Getting roles');
    return Promise.resolve([]);
  },
  getRegions: async () => {
    console.log('Getting regions');
    return Promise.resolve([]);
  },
  getSectors: async (regionId?: string) => {
    console.log('Getting sectors for region:', regionId);
    return Promise.resolve([]);
  },
  getSchools: async (sectorId?: string) => {
    console.log('Getting schools for sector:', sectorId);
    return Promise.resolve([]);
  }
};

export default enhancedUserService;
