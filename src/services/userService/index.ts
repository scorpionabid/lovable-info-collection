
import { EntityOption } from './types';

// Export the User interface from userService
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
  utis_code?: string;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  roles?: {
    id: string;
    name: string;
    description?: string;
    permissions: string[] | any;
  },
  role?: string;
  roleName?: string;
}

// Export other types from types.ts
export * from './types';

// Create mock API functions for development
const userService = {
  // User management
  getUsers: async () => {
    console.log('Mock: fetching users');
    return { data: [], count: 0, error: null };
  },
  
  getUserById: async (id: string) => {
    console.log(`Mock: fetching user with ID ${id}`);
    return { id, email: 'mock@example.com', first_name: 'Mock', last_name: 'User', role_id: '1', is_active: true, created_at: new Date().toISOString() };
  },
  
  createUser: async (userData: any) => {
    console.log('Mock: creating user', userData);
    return { ...userData, id: 'new-user-id', created_at: new Date().toISOString() };
  },
  
  updateUser: async (id: string, userData: any) => {
    console.log(`Mock: updating user ${id}`, userData);
    return { ...userData, id, updated_at: new Date().toISOString() };
  },
  
  deleteUser: async (id: string) => {
    console.log(`Mock: deleting user ${id}`);
    return true;
  },
  
  blockUser: async (id: string) => {
    console.log(`Mock: blocking user ${id}`);
    return true;
  },
  
  activateUser: async (id: string) => {
    console.log(`Mock: activating user ${id}`);
    return true;
  },
  
  resetPassword: async (id: string) => {
    console.log(`Mock: resetting password for user ${id}`);
    return true;
  },
  
  changePassword: async (oldPassword: string, newPassword: string) => {
    console.log('Mock: changing password');
    return true;
  },
  
  // Organization data methods
  getRoles: async (currentUserId?: string, currentUserRole?: string): Promise<EntityOption[]> => {
    return [
      { id: 'super_admin', name: 'Super Admin' },
      { id: 'region_admin', name: 'Region Admin' },
      { id: 'sector_admin', name: 'Sector Admin' },
      { id: 'school_admin', name: 'School Admin' }
    ];
  },

  getRegions: async (currentUserId?: string, currentUserRole?: string): Promise<EntityOption[]> => {
    return [
      { id: '1', name: 'Bakı' },
      { id: '2', name: 'Sumqayıt' },
      { id: '3', name: 'Gəncə' }
    ];
  },

  getSectors: async (regionId?: string, currentUserId?: string, currentUserRole?: string): Promise<EntityOption[]> => {
    console.log(`Fetching sectors for region ID: ${regionId}`);
    return [
      { id: '1', name: 'Sektor 1' },
      { id: '2', name: 'Sektor 2' },
      { id: '3', name: 'Sektor 3' }
    ];
  },

  getSchools: async (sectorId?: string, currentUserId?: string, currentUserRole?: string): Promise<EntityOption[]> => {
    console.log(`Fetching schools for sector ID: ${sectorId}`);
    return [
      { id: '1', name: 'Məktəb 1' },
      { id: '2', name: 'Məktəb 2' },
      { id: '3', name: 'Məktəb 3' }
    ];
  }
};

export default userService;
